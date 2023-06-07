import React, { useState, useRef } from 'react';
import './App.css';

const Calendar = () => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [days, setDays] = useState([
    [], // Monday
    [], // Tuesday
    [], // Wednesday
    [], // Thursday
    [], // Friday
    [], // Saturday
    []  // Sunday
  ]);
const [showMessage,setShowMessage]=useState(true);
  const isDraggingRef = useRef(false);
  const startSlotRef = useRef(null);

  const formatTimeRange = (array) => {
    console.log(days)
    const formattedTimes = [];
    let start = null;
    let end = null;
    array.sort((a, b) => a - b);
    for (let i = 0; i < array.length; i++) {
      if (start === null) {
        start = array[i];
      }

      if (i === array.length - 1 || array[i] + 1 !== array[i + 1]) {
        end = array[i];
        if (start === end) {
          formattedTimes.push(formatTime(start));
        } else {
          formattedTimes.push(`${formatTime(start)}~${formatTime(end)}`);
        }
        start = null;
        end = null;
      }
    }

    return formattedTimes.join(", ");
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 2);
    const minutes = time % 2 === 0 ? "00" : "30";
    return `${padZero(hours)}:${minutes}`;
  };

  const padZero = (number) => {
    return number.toString().padStart(2, "0");
  };

  
  const handleTime = (day, time) => {
  setShowMessage(false)
  setDays((prevDays) => {
    const updatedDays = [...prevDays];
    if (!updatedDays[day].includes(time)) {
      updatedDays[day] = [...updatedDays[day], time];
    }
    return updatedDays;
  });
};


  const handleSlotClick = (day, time) => {
    handleTime(day, time);
    const slot = { day, time };
    const updatedSlots = [...selectedSlots, slot];
    setSelectedSlots(updatedSlots);
  };

  const handleSlotMouseDown = (day, time) => {
    isDraggingRef.current = true;
    startSlotRef.current = { day, time };
  };

  const handleSlotMouseUp = () => {
    isDraggingRef.current = false;
    startSlotRef.current = null;
  };

  const handleSlotMouseEnter = (day, time) => {
    if (isDraggingRef.current && startSlotRef.current) {
      const { day: startDay, time: startTime } = startSlotRef.current;
      const endSlot = { day, time };
      const updatedSlots = [...selectedSlots, startSlotRef.current, endSlot];
      setSelectedSlots(updatedSlots);
      handleTime(startSlotRef.current.day, startSlotRef.current.time);
      handleTime(day, time);
      handleTime(startDay, startTime);
      startSlotRef.current = endSlot;
      handleSlotDrag(startDay, startTime, day, time);
    }
  };

  const handleSlotDrag = (startDay, startTime, endDay, endTime) => {
    const startSlot = { day: startDay, time: startTime };
    const endSlot = { day: endDay, time: endTime };
    const updatedSlots = [...selectedSlots, startSlot, endSlot];
    setSelectedSlots(updatedSlots);
    handleTime(startDay, startTime);
    handleTime(endDay, endTime);
  };

  const handleClearSlots = () => {
    setShowMessage(true)
    setSelectedSlots([]);
       setDays([
      [], // Monday
      [], // Tuesday
      [], // Wednesday
      [], // Thursday
      [], // Friday
      [], // Saturday
      []  // Sunday
    ]);
  };

  const handleWeekdayGoldTime = () => {
 
    const weekdaySlots = [];
    for (let day = 0; day < 5; day++) {
      for (let time = 18; time < 44; time++) { // 9am to 9pm (exclusive)
        weekdaySlots.push({ day, time });
        handleTime(day, time);
      }
    }
    setSelectedSlots(weekdaySlots);
   
    
  };

  const handleWeekendGoldTime = () => {
    const weekendSlots = [];
    for (let day = 5; day < 7; day++) {
      for (let time = 18; time < 44; time++) { // 9am to 9pm (exclusive)
        weekendSlots.push({ day, time });
        handleTime(day, time);
      }
    }
    setSelectedSlots(weekendSlots);
  };

  return (
    <div className="calendar">
      <table className="calendar-table">
        <thead>
          <tr>
            <th colSpan="41"></th>
            <th style={{ backgroundColor: 'rgb(38, 175, 238)' }} colSpan="2"></th>
            <th colSpan="2">已选</th>
             <th colSpan="2"></th>
            <th colSpan="2">未选</th>   
          </tr>
          <tr>
            <th className='title' rowSpan="2">星期/时间</th>
            <th colSpan="24">00:00-12:00</th>
            <th colSpan="24">12:00-24:00</th>
          </tr>
          <tr>
            {[...Array(12)].map((_, time) => (
              <th colSpan="2" key={time}>{time}</th>
            ))}
            {[...Array(12)].map((_, time) => (
              <th colSpan="2" key={time + 12}>{time + 12}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'].map((weekday, index) => (
            <tr key={index}>
              <td>{weekday}</td>
              {[...Array(48)].map((_, time) => (
                <td
                  key={time}
                  className={`${
                    selectedSlots.some((slot) => slot.day === index && slot.time === time) ? 'selected' : ''
                  } cell`}
                  onClick={() => handleSlotClick(index, time)}
                  onMouseDown={() => {
                    if (!isDraggingRef.current) {
                      handleSlotMouseDown(index, time);
                    }
                  }}
                  onMouseUp={handleSlotMouseUp}
                  onMouseEnter={() => handleSlotMouseEnter(index, time)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='message1'>
      {selectedSlots.length === 0 && showMessage && (
        <div className="message">可拖动鼠标选择时间段</div>
      )}
      {selectedSlots.length > 0 && (
        <div className="message">已选择时间段 <button onClick={handleClearSlots}>清空</button></div>
      )}
    
      <div className="selected-slots">
        {days[0].length > 0 && (
          <div className="slot">{`星期一: ${formatTimeRange(days[0])}`}</div>
        )}
        {days[1].length > 0 && (
          <div className="slot">{`星期二: ${formatTimeRange(days[1])}`}</div>
        )}
        {days[2].length > 0 && (
          <div className="slot">{`星期三:${formatTimeRange(days[2])}`}</div>
        )}
        {days[3].length > 0 && (
          <div className="slot">{`星期四: ${formatTimeRange(days[3])}`}</div>
        )}
        {days[4].length > 0 && (
          <div className="slot">{`星期五: ${formatTimeRange(days[4])}`}</div>
        )}
        {days[5].length > 0 && (
          <div className="slot">{`星期六: ${formatTimeRange(days[5])}`}</div>
        )}
        {days[6].length > 0 && (
          <div className="slot">{`星期日: ${formatTimeRange(days[6])}`}</div>
        )}
      </div>
     <div  className='my_button'>      <button onClick={handleWeekdayGoldTime}>工作日黄金时间</button>
      <button onClick={handleWeekendGoldTime}>休息日黄金时间</button></div>
 </div>
   {showMessage && (
        <div className="message2">请选择时间段</div>
      )}
    </div>
  );
};

export default Calendar;

