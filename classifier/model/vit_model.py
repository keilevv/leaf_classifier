import torch
import torch.nn as nn
from timm import create_model

class LeafClassifier:
    def __init__(self, model_path, class_names):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.class_names = class_names

        self.model = create_model("vit_base_patch16_224", pretrained=False)
        self.model.head = nn.Linear(self.model.head.in_features, len(class_names))
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.eval().to(self.device)

    def predict(self, image_tensor):
        with torch.no_grad():
            image_tensor = image_tensor.unsqueeze(0).to(self.device)
            output = self.model(image_tensor)
            _, pred = torch.max(output, 1)
            confidence = torch.softmax(output, dim=1)[0, pred].item()
            class_name = self.class_names[pred.item()]
            return class_name, confidence
