from torchvision import transforms
from PIL import Image
import io

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])

def preprocess_image(file_bytes):
    image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    return transform(image)
