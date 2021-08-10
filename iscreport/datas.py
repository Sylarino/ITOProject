import pandas as pd

df = pd.read_csv('requisitoscalidad.csv', encoding='latin-1',sep=";",header=0)

requirements = []

#for i in df.index:
#    print(i)
#    requirements.append({
#        'requirement_name': df[i]['nombre_requisito'],
#        'reference': df[i]['referencia']
#            })

for _, row in df.iterrows():
        print(f"La zona sísmica de es: {row.id_grupo} {row.nombre_requisito}")


