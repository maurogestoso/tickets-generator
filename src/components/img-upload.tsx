import { useImg } from "@/lib/use-img-upload";
import { useNavigate } from "react-router";
import { TypographyH1 } from "./ui/typography";
import { Input } from "./ui/input";

export function ImageUpload() {
  const { setImg } = useImg();
  const navigate = useNavigate();

  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const newImg = new Image();
      newImg.src = e.target?.result as string;
      setImg(newImg);
      navigate("/template-editor");
    };
  }

  return (
    <>
      <TypographyH1>Image Upload</TypographyH1>
      <Input
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={loadImage}
      />
    </>
  );
}
