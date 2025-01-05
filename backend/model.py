from sentence_transformers import SentenceTransformer
import chromadb

# Initialize the model and ChromaDB client
model = SentenceTransformer('/Users/rongzhenchen/cursor/model/acge_text_embedding')  # Update your model path
client = chromadb.Client(chromadb.config.Settings(anonymized_telemetry=False, is_persistent=True, persist_directory="/Users/rongzhenchen/cursor/data/chromadb"))

# Connect to or create a collection
collection = client.get_or_create_collection("my_collection")
#print(f"Number of documents in collection: {len(collection.get()['documents'])}")

def get_answer(question, top_k=3):
    # Encode the input question to a vector
    vector = model.encode(question)
    
    # Query the collection for the most similar vectors
    results = collection.query(
        query_embeddings=[vector],  # Pass the vector as a list
        n_results=top_k  # Number of top similar items to retrieve
    )
    #print(results)
    # Extract the most similar answer and similar questions
    if results['metadatas']:  # 检查是否有返回的元数据
        similar_answers = [meta['answer'] for meta in results['metadatas'][0]]  # 获取相似问题
        similar_questions = [meta['question'] for meta in results['metadatas'][0]]  # 获取相似问题
        return similar_answers, similar_questions
    else:
        return None, []  # 没有找到结果

def submit_no_answer(question):
    # Encode the input question to a vector
    vector = model.encode(question)
    
    index = len(collection.get()['documents'])
    collection.add(
        documents=[question],  # Use the question string
        embeddings=[vector],  # Pass the vector as embeddings
        metadatas=[{'answer': '未回答问题', 'question': question}],  # 添加元数据
        ids=[f'id_{index}']  # 使用唯一 ID
    )

def query_data_from_db():
    # Get the total number of documents
    total_documents = len(collection.get()['documents'])
    
    # Get the documents and their corresponding metadata
    documents = collection.get()['documents']
    metadatas = collection.get()['metadatas']
    ids = collection.get()['ids']

    # Get the unanswered questions and their IDs
    unanswered_docs = [
        {'question': metadatas[i]['question'], 'id': ids[i]} 
        for i in range(len(metadatas)) 
        if metadatas[i]['answer'] == '未回答问题'
    ]
    
    unanswered_count = len(unanswered_docs)

    return total_documents, unanswered_count, unanswered_docs

def delete_unanswered_question(question_id):
    # Logic to delete the question from ChromaDB
    try:
        collection.delete(ids=[question_id])
    except Exception as e:
        print(f"Error deleting question with ID {question_id}: {e}")  # Log the error
        raise  # Re-raise the exception to be caught in the app.py

def update_unanswered_question(question_id, new_answer):
    # Get the current documents and metadata
    documents = collection.get()['documents']
    metadatas = collection.get()['metadatas']
    ids = collection.get()['ids']

    # Find the index of the document with the given ID
    index = None
    for i, doc_id in enumerate(ids):
        if doc_id == question_id:
            index = i
            break

    if index is not None:
        # Prepare the data for upsert
        updated_document = documents[index]  # Keep the same document
        updated_metadata = metadatas[index]  # Get the current metadata
        updated_metadata['answer'] = new_answer  # Update the answer

        # Perform the upsert operation
        collection.update(
            ids=[question_id],  # Use the same ID
            metadatas=[updated_metadata],  # Update the metadata with the new answer
        )
    else:
        raise ValueError(f"Question ID {question_id} not found.")

# Example usage
if __name__ == "__main__":
    question = "如何评估模型的准确性"
    similar_answers, similar_questions = get_answer(question)
    if similar_answers:
        print("Answer:", similar_answers)
        print("Similar Questions:", similar_questions)
    else:
        print("No similar questions found.")
