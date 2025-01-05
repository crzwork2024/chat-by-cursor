import pandas as pd
from sentence_transformers import SentenceTransformer
import chromadb  # 导入 chromadb
import logging  # 添加日志模块

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def import_data(file_path):
    # 读取Excel文件
    logging.info(f'开始导入数据，文件路径: {file_path}')  # 添加日志
    df = pd.read_excel(file_path)
    logging.info(f'成功读取Excel文件，行数: {len(df)}')  # 添加日志，显示读取的行数
    model = SentenceTransformer('/Users/rongzhenchen/cursor/model/acge_text_embedding')  # 替换为你的模型路径
    logging.info('加载模型成功')  # 添加日志

    # 创建 Chroma 客户端
    client = chromadb.Client(chromadb.config.Settings(anonymized_telemetry=False, is_persistent=True, persist_directory="/Users/rongzhenchen/cursor/data/chromadb"))  # 初始化向量数据库客户端
    logging.info('向量数据库客户端初始化成功')  # 添加日志

    # 创建集合
    collection = client.create_collection("my_collection")  # 创建集合
    logging.info('集合 "my_collection" 创建成功')  # 添加日志

    for index, row in df.iterrows():
        question = row['问题']
        answer = row['答案']
        logging.debug(f'处理第 {index + 1} 行: 问题: {question}, 答案: {answer}')  # 添加详细日志
        vector = model.encode(question)
        logging.debug(f'问题: {question} 的向量表示: {vector}')  # 添加向量表示的日志
        
        # 存入向量数据库
        collection.add(
            documents=[question],  # Use the question string
            embeddings=[vector],  # Pass the vector as embeddings
            metadatas=[{'answer': answer, 'question': question}],  # 添加元数据
            ids=[f'id_{index}']  # 使用唯一 ID
        )
        logging.info(f'已添加问题: {question}，答案: {answer} 到集合')  # 添加日志

    logging.info('数据导入完成')  # 添加日志
    print(f"Number of documents in collection: {len(collection.get()['documents'])}")


if __name__ == '__main__':
    import_data('/Users/rongzhenchen/cursor/data/questions_answers.xlsx')  # 替换为你的Excel文件路径 