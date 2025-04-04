import eventService from "@/api/eventService";
import { useAuth } from "../../hooks/useAuth";

const FormEventHandlers = (event, setEvent, setPreview, setError) => {
  const { handlePostEvent } = eventService();
  const { user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size <= 5 * 1024 * 1024) {
        // Limite de 5MB
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(",")[1]; // Remove o cabeçalho do base64
          setEvent((prevEvent) => ({
            ...prevEvent,
            image: base64String,
          }));
        };
        reader.readAsDataURL(file);
        setPreview(URL.createObjectURL(file));
        setError("");
      } else {
        setError("O tamanho da imagem deve ser menor que 5MB.");
      }
    } else {
      setError("Por favor, selecione um arquivo de imagem.");
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setEvent((prevEvent) => ({
      ...prevEvent,
      image: null,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await handlePostEvent(user.id, event);
      return response;
    } catch (error) {
      console.error("ERRO: ", error);
    }
  };

  return {
    handleInputChange,
    handleFileChange,
    handleRemoveImage,
    handleSubmit,
  };
};

export default FormEventHandlers;
