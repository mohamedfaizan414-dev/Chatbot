import streamlit as st
from chatbot import ac
from langchain_core.messages import HumanMessage,SystemMessage

thread_id = '1'
config = {'configurable': {'thread_id':thread_id}}
if 'history' not in st.session_state:
    st.session_state['history'] = []

user_input = st.chat_input('Type here')
for m in st.session_state['history']:
    with st.chat_message(m['role']):
        st.text(m['content'])

if user_input:
    st.session_state['history'].append({'role':'user','content':user_input})
    with st.chat_message('user'):
        st.text(user_input)
    response = ac.invoke({'message': [HumanMessage(content = user_input),SystemMessage(content="Reply only in plain text. do not use markdown or symbols.")]} ,config = config)
    ai = response['message'][-1].content
    st.session_state['history'].append({'role':'assistant','content':ai})
    with st.chat_message('assistant'):
        st.text(ai)