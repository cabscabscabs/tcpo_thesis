import pandas as pd

df = pd.read_csv('eval_detailed_20260430_144922.csv')

print('=== FAITHFULNESS ANALYSIS ===\n')

print('Faithfulness Distribution:')
print(f'  Excellent (>=0.8): {len(df[df["faithfulness"]>=0.8])}')
print(f'  Good (0.6-0.8): {len(df[(df["faithfulness"]>=0.6) & (df["faithfulness"]<0.8)])}')
print(f'  Fair (0.4-0.6): {len(df[(df["faithfulness"]>=0.4) & (df["faithfulness"]<0.6)])}')
print(f'  Poor (<0.4): {len(df[df["faithfulness"]<0.4])}')

print(f'\nTotal samples: {len(df)}')
print(f'Samples with faithfulness < 0.5: {len(df[df["faithfulness"] < 0.5])}')

print('\n=== LOWEST FAITHFULNESS QUESTIONS ===')
low_faith = df.nsmallest(10, 'faithfulness')
for idx, row in low_faith.iterrows():
    print(f'\nQ: {row["question"]}')
    print(f'   Faithfulness: {row["faithfulness"]}')
    print(f'   Feedback: {row["feedback"][:150]}...')
