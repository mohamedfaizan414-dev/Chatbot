from langgraph.graph import StateGraph, START,END
from langchain_groq import ChatGroq
from typing import TypedDict,Annotated
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from dotenv import load_dotenv
load_dotenv()

class chatbot(TypedDict):
    message: Annotated[list[BaseMessage], add_messages]


llm=ChatGroq(model="openai/gpt-oss-20b", temperature=1,streaming=True)

def msg(state:chatbot):
    c=state['message']
    b = llm.invoke(c).content
    return{'message':[b]}

chk = MemorySaver()
graph = StateGraph(chatbot)
graph.add_node('message',msg)

graph.add_edge(START,'message')
graph.add_edge('message',END)
ac = graph.compile(checkpointer= chk)
thread_id = '1'
