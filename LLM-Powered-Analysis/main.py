from transformers import AutoTokenizer, AutoModelForCausalLM
import transformers
import torch

model_id = "jcordon5/Mistral-7B-cybersecurity-rules"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)
model.config.pad_token_id = tokenizer.eos_token_id 

MAX_INPUT_TOKEN_LENGTH = 4096

messages = [{
    "role": "user",
    "content": '''You are a cybersecurity expert, and you are respnsible to analyze the SHAP values produced by an explainable AI component. 
                  You are responsible to analyze why the classifier has classified the instance to the given class. 
                  I want at first a brief overview, then the explanation in bullet points (the bullet points should be displayed as •) which will include markdown, and finally a conclusion. 
                  The brief overview should begin with the following based on the input of SHAP values for the given class.
                  I want to explain whether the given features really matter in predicting the assosiated class.
                  I do not want to take into consideration the importance of each feature. I do not want any introductory information and any headings e.g. Summary.
                  Make bold all the features/classes and do not use any " in the response.
                  Here is the output from the classifier.
            
                {
    "class": "Outage_Risk",
    "top_features": [
        {
            "feature_name": "tx_pkts",
            "importance": 2.8807356357574463,
            "description": "Number of transmitted packets in downlink"
        },
        {
            "feature_name": "dl_cqi",
            "importance": 0.8394917249679565,
            "description": "Channel Quality Indicator for downlink"
        },
        {
            "feature_name": "sum_granted_prbs",
            "importance": 0.47345030307769775,
            "description": "Sum of granted Physical Resource Blocks"
        },
        {
            "feature_name": "sum_requested_prbs",
            "importance": 0.25738516449928284,
            "description": "Sum of requested Physical Resource Blocks"
        },
        {
            "feature_name": "dl_buffer",
            "importance": 0.03884560987353325,
            "description": "Buffer size in the downlink direction"
        }
    ]
}
Give an explanataion to a beginner without reference the SHAP values.'''
}]

pipeline = transformers.pipeline(
    "text-generation", model=model_id, model_kwargs={"torch_dtype": torch.bfloat16}, device_map="auto"
)
output = pipeline(messages, max_new_tokens = MAX_INPUT_TOKEN_LENGTH)

print(output[0]["generated_text"][-1]["content"])