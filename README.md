# Chatbot
# 🤖 NeuralChat — Multi-Agent Autonomous Chatbot Engine

NeuralChat is an advanced asynchronous multi-agent chatbot backend architected with a cyclic, state-managed execution graph. Utilizing **LangChain Core**, the system manages complex multi-turn dialogue, structured memory retrieval, and native real-time token streaming through a decoupled **FastAPI & Uvicorn** gateway.

---

## 🏗️ State Graph & Workflow Architecture

NeuralChat processes prompts using a highly modular state machine network. Instead of rigid linear chains, execution loops back dynamically through an isolated node configuration based on runtime constraints.
