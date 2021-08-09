import pandas as pd

df = pd.read_csv('requisitoscalidad.csv', encoding='latin-1',sep=";")

requirements = []

for i in df:
    requirements.append({
        'requirement_name': i['requirement_name'],
        'reference': i['reference']
            })

