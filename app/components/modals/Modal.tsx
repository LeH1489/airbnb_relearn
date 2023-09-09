"use client";

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string; //Header of Modals
  body?: React.ReactElement; //html of body
  footer?: React.ReactElement; //html of footer
  actionLabel: string; //name of first button
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLable?: string; //name of second button
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLable,
}) => {
  //using this state to add animation (translate)
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return; //break the func
    }

    setShowModal(false); //translate y -100% (not close modal yet)
    setTimeout(() => {
      onClose(); //delay 3s onClose func  (for smoth animation)  //actually close modal
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return; //break the func
    }

    onSubmit(); //execute the action
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    //check secondaryAction existing
    if (disabled || !secondaryAction) {
      return; //break the func
    }

    secondaryAction(); //if we have secondaryAction => execute the action
  }, [disabled, secondaryAction]);

  //true => open this modal, false => close this modal
  if (!isOpen) {
    return null;
  }

  const CenterScreen =
    "fixed z-50 inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-neutral-800/70";

  const Responsive =
    "relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto";

  const TranslateStyle = `transform duration-300 h-full ${
    showModal ? "translate-y-0" : "translate-y-full"
  } ${showModal ? "opacity-100" : "opacity-0"}`;

  const Window =
    "bg-white outline-none focus:outline-none flex flex-col w-full translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative";

  const Header =
    "flex items-center justify-center relative p-6 rounded-t border-b-[1px]";

  const ButtonClose =
    "px-4 py-3 rounded-full border-0 hover:bg-gray-100 transition absolute left-5";

  const Title = "text-lg font-bold";

  const BodyStyle = "relative p-6 flex-auto";

  const FooterStyle = "flex flex-col gap-2 p-6";

  const TwoButtonStyle = "flex flex-row items-center gap-4 w-full ";

  return (
    <>
      <div className={CenterScreen}>
        <div className={Responsive}>
          {/* content */}
          <div className={TranslateStyle}>
            <div className={Window}>
              {/* Header */}
              <div className={Header}>
                <button className={ButtonClose} onClick={handleClose}>
                  <IoMdClose size={20} />
                </button>
                <div className={Title}>{title}</div>
              </div>
              {/* body */}
              <div className={BodyStyle}>{body}</div>
              {/* footer */}
              <div className={FooterStyle}>
                <div className={TwoButtonStyle}>
                  {secondaryAction && secondaryActionLable && (
                    <Button
                      disabled={disabled}
                      label={secondaryActionLable}
                      onClick={handleSecondaryAction}
                      outline
                    />
                  )}
                  <Button
                    disabled={disabled}
                    label={actionLabel}
                    onClick={handleSubmit}
                  />
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
