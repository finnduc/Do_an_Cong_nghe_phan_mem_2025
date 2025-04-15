from unsloth import FastLanguageModel
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="gianghp/Qwen2.5Coder-0.5B-Instruct-T2SQL-ttcs",
    max_seq_length=2048,
    dtype=None,
    load_in_4bit=False,
)
FastLanguageModel.for_inference(model)
