import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TextDisplayProps {
  text: string;
  type?: 'info' | 'notification';
  sendDate?: Date | string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ text, type = 'info', sendDate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLongText, setIsLongText] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Mesure la hauteur du texte après que le composant soit monté et rendu
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight, 10) || 20; // Fallback 20
      const maxLines = 2;
      const maxHeight = lineHeight * maxLines;

      // Vérifie si le texte dépasse la hauteur maximale
      setIsLongText(textRef.current.scrollHeight > maxHeight);
    }
  }, [text]);

  const textStyle = cn(
    "text-sm",
    type === 'info' && "text-gray-700",
    type === 'notification' && "text-blue-700",
    isLongText && !isExpanded && "line-clamp-2" // Applique la limitation à 2 lignes par défaut
  );

  const formattedDate = sendDate
    ? typeof sendDate === 'string'
      ? new Date(sendDate).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      : sendDate.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="space-y-2 bg-white p-2 rounded" style={{ wordWrap: 'break-word' }}>
      <p ref={textRef} className={textStyle} style={{ whiteSpace: 'pre-line' }}>{text}</p>
      {isLongText && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0 text-blue-500 hover:text-blue-700"
        >
          {isExpanded ? 'Afficher moins' : 'Afficher plus'}
        </Button>
      )}
      {formattedDate && (
        <p className="text-xs text-gray-500">
          Envoyé le : {formattedDate}
        </p>
      )}
    </div>
  );
};

export default TextDisplay;

