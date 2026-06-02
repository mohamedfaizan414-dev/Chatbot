from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated
import operator

from app.core.config import get_settings

settings = get_settings()

SYSTEM_PROMPT = """You are NeuralChat, a sharp and helpful AI assistant. You give clear, concise, and thoughtful responses.

Guidelines:
- Be direct and genuinely helpful
- Keep responses focused and well-structured
- If asked to write code, use proper formatting
- Maintain context across the conversation
- Don't be overly verbose — quality over quantity"""


class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]


def _build_llm() -> ChatGroq:
    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model="llama-3.3-70b-versatile",
        temperature=0.2,
        max_tokens=2000
    )


def _build_graph() -> StateGraph:
    llm = _build_llm()

    prompt = ChatPromptTemplate.from_messages([
        SystemMessage(content=SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="messages"),
    ])

    chain = prompt | llm

    def chat_node(state: AgentState) -> dict:
        response = chain.invoke({"messages": state["messages"]})
        return {"messages": [response]}

    graph = StateGraph(AgentState)
    graph.add_node("chat", chat_node)
    graph.set_entry_point("chat")
    graph.add_edge("chat", END)

    return graph.compile(checkpointer=MemorySaver())


class ChatAgent:
    def __init__(self):
        self._graph = _build_graph()

    def _build_messages(self, history: list, new_message: str) -> list[BaseMessage]:
        messages: list[BaseMessage] = []
        for msg in history[-(settings.MAX_HISTORY_MESSAGES):]:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                messages.append(AIMessage(content=msg.content))
        messages.append(HumanMessage(content=new_message))
        return messages

    async def invoke(self, session_id: str, message: str, history: list) -> tuple[str, str]:
        messages = self._build_messages(history, message)
        config = {"configurable": {"thread_id": session_id}}

        result = await self._graph.ainvoke(
            {"messages": messages},
            config=config,
        )

        reply = result["messages"][-1].content
        return reply, settings.GROQ_MODEL

    async def stream(self, session_id: str, message: str, history: list):
        messages = self._build_messages(history, message)
        config = {"configurable": {"thread_id": session_id}}

        async for event in self._graph.astream_events(
            {"messages": messages},
            config=config,
            version="v1",
        ):
            kind = event.get("event")
            if kind == "on_chat_model_stream":
                chunk = event["data"]["chunk"]
                if chunk.content:
                    yield chunk.content
