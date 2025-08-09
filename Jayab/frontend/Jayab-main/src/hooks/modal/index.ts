import { useCallback, useState } from "react";

export const useModal = (initialMode = false) => {
  const [isModalOpen, setIsModalOpen] = useState(initialMode);
  const handleOpen = useCallback(() => setIsModalOpen(true), []);
  const handleClose = useCallback(() => setIsModalOpen(false), []);
  return { isModalOpen, handleOpen, handleClose };
};
