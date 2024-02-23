import React, { useState } from "react";
import Modal from 'react-modal';
import CloseIcon from '@mui/icons-material/Close';

const customStyles = {
    overlay: {
      zIndex: 1000,
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto',
      backgroundColor: 'transparent',
      border: 'none',
    },
  };
  
  Modal.setAppElement('#root');
  
  const PopUpImage = ({ image }) => {
    const [openModal, setOpenModal] = useState(false);
  
    return (
      <>
        <img src={image} alt="Post" className="rounded-lg w-full h-full object-cover" onClick={() => setOpenModal(true)}/>
        <Modal
          isOpen={openModal}
          onRequestClose={() => setOpenModal(false)}
          style={customStyles}
          contentLabel="Image Modal"
        >
          <div className="text-center">
            <button onClick={() => setOpenModal(false)} className="absolute top-8 right-7 text-white bg-gray-200/[.06] rounded-full p-2 hover:bg-gray-200/[0.7] transition duration-200">
                <CloseIcon/>
            </button>
            <img src={image} alt="Post" className="rounded-lg object-contain" style={{maxHeight: '80vh', maxWidth: '90vh'}}/>
          </div>
        </Modal>
      </>
    );
  }
  
  export default PopUpImage;