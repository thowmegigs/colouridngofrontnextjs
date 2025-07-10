// WhatsAppChatButton.js

import { useMobile } from "@/hooks/use-mobile";
import Image from "next/image";

const WhatsAppChatButton = ({ phone = "+919991110716", message = "Hello!" }) => {
  const isMobile=useMobile()
  const encodedMessage = encodeURIComponent(message);
  const chatLink = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodedMessage}`;

  return (
    <a
      href={chatLink}
      target="_blank"
      rel="noopener noreferrer"
      
    >
      <Image alt="whatap-icon" src={'/whatsapp.png'} 
      width={45} 
      height={45}
       />
    </a>
  );
};

export default WhatsAppChatButton;
