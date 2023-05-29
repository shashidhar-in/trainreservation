import React, { useEffect, useState } from "react";
import "./styles.css";
import { Modal, Button } from "react-bootstrap";

const SeatReservation = () => {
  const totalSeats = 80;
  const seatsPerRow = 7;
  const lastRowSeats = 3;

  const [bookedSeats, setBookedSeats] = useState([]);
  const [seats, setSeats] = useState(Array(totalSeats).fill(false));
  const [numSeats, setNumSeats] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lastBookedIndex, setLastBookedIndex] = useState(-1);
  const [modalContent, setModalContent] = useState("");
  const[modalTitle,setModalTile]=useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedBookedSeats = localStorage.getItem("bookedSeats");
    if (storedBookedSeats) {
      setBookedSeats(JSON.parse(storedBookedSeats));
    }

    const storedLastBookedIndex = localStorage.getItem("lastBookedIndex");
    if (storedLastBookedIndex) {
      setLastBookedIndex(parseInt(storedLastBookedIndex));
    }
  }, []);

  useEffect(() => {
    if (bookedSeats.length > 0) {
      localStorage.setItem("bookedSeats", JSON.stringify(bookedSeats));
    }
  }, [bookedSeats]);

  const handleSeatSelection = () => {
    const numSeatsInt = parseInt(numSeats);
    if(numSeatsInt>7){
        const modalContent = "You cannot book more than 7 tickets at a time!";
    setModalTile("Error!")
      setModalContent(modalContent);
      setShowModal(true);
    }
    if (numSeatsInt > 0 && numSeatsInt <= 7) {
      const updatedSeats = [...seats];
    // Start from the last booked index + 1 or 0 if no seats are booked yet
      let startIndex = lastBookedIndex !== -1 ? lastBookedIndex + 1 : 0; 
      let selectedCount = 0;

      for (let i = startIndex; i < seats.length; i++) {
        if (updatedSeats[i] === false && selectedCount < numSeatsInt) {
          updatedSeats[i] = true;
          setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, i]);
          selectedCount++;

          if (selectedCount === numSeatsInt) {
            break;
          }
        }
      }

      setSeats(updatedSeats);
    }
  };

  const handleBookSeats = () => {
          setSelectedSeats([]);
    if (selectedSeats.length > 0) {
      const bookedSeatNumbers = selectedSeats.map((seatIndex) => seatIndex + 1);
      const modalContent = "Booked Seats: " + bookedSeatNumbers.join(",");
      setModalTile("Booking Successful!")
      setModalContent(modalContent);
      setShowModal(true);

      const updatedBookedSeats = [...bookedSeats, ...selectedSeats];
      setBookedSeats(updatedBookedSeats);
      setSelectedSeats([]);

      // Update the lastBookedIndex when seats are booked
      const lastSelectedIndex = Math.max(...selectedSeats);
      setLastBookedIndex(lastSelectedIndex);
      localStorage.setItem("lastBookedIndex", lastSelectedIndex.toString());

      setNumSeats("");
    } else {
      const modalContent = "You have to select seats to book!";
        setModalTile("Error!")
      setModalContent(modalContent);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderSeats = () => {
    const seatGrid = [];
    const rows = Math.ceil(totalSeats / seatsPerRow);

    let seatNumber = 1;

    for (let row = 0; row < rows; row++) {
      const rowSeats = [];

      const seatsInRow = row === rows - 1 ? lastRowSeats : seatsPerRow;

      for (let i = 0; i < seatsInRow; i++) {
        const seatIndex = row * seatsPerRow + i;

        const isBooked = bookedSeats.includes(seatIndex);
        const isReserved = seats[seatIndex];
        const isSelected = selectedSeats.includes(seatIndex);

        let seatClass = "available";
        if (isBooked) {
          seatClass = "booked";
        } else if (isSelected) {
          seatClass = "selected";
        } else if (isReserved) {
          seatClass = "reserved";
        }

        rowSeats.push(
          <div key={seatIndex} className={`seat ${seatClass}`}>
            {seatNumber}
          </div>
        );

        seatNumber++;
      }
      seatGrid.push(rowSeats);
    }

    return seatGrid.map((rowSeats, index) => (
      <div key={index} className="seat-row">
        {rowSeats}
      </div>
    ));
  };

  return (
    <div className="seat-reservation">
      <div className="input-container">
        <input
          type="number"
          placeholder="enter number"
          min="1"
          max="7"
          value={numSeats}
          onChange={(e) => setNumSeats(e.target.value)}
        />
        <button onClick={handleSeatSelection}>Select Seats</button>
      </div>
      <div className="seat-map">{renderSeats()}</div>
      <button onClick={handleBookSeats}>Book Now</button>

      <Modal   aria-labelledby="contained-modal-title-vcenter"
      centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalContent}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SeatReservation;
