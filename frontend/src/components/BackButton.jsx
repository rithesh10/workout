import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

const BackButton = ({ className }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full ${className}`}
      onClick={() => navigate(-1)}
      aria-label="Go back"
    >
      <ArrowLeft className="h-6 w-6" />
    </Button>
  );
};

export default BackButton;
