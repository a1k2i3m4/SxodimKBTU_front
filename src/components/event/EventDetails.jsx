import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useEventContext } from '../../context/EventContext';
import EventTag from '../tags/EventTag';
import "./EventDetails.css";
import ErrorModal from '../error/ErrorModal';


const EventDetails = () => {
    const { getEventById, checking } = useEventContext();
    const { id } = useParams();
    const [ errorModalIsOpen, setErrorModalIsOpen ] = useState(false);
    const [error] = useState('');
    const foundEvent = getEventById(Number(id));
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if(!loading) {
          const contentElement = document.getElementById('loading');
          contentElement.style.justifyContent = "flex-start";
        }
    },[]);

    if (loading) {
        return <div className="center-container">
            <Spin
                className="loading custom-spin"
                spinning={loading}
                tip="Processing..."
                indicator={
                    <LoadingOutlined
                        style={{
                            fontSize: 24,
                        }}
                    />
                }
            >.</Spin>
        </div>;
    }

    if (!foundEvent) {
        return <p>Event not found</p>;
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log(file)
        setFile(file);
    }

    const handleUpload = async() => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file)

            const response = await fetch('http://127.0.0.1:8080/api/image', {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                console.log('errrrrorrrrr')
                throw new Error('File upload failed');
            }
            const responseData = await response.json();
            setTimeout(() => {
                setImageUrl(responseData.imageUrl);
                setLoading(false);
            }, 2000);
        } catch (error) {
            console.error('Error uploading file:', error.message);
            setLoading(false);
        }
    }


    return (
        <Spin
            id='loading'
            spinning={loading}
            tip="Enrolling you into..."
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                }}
              />
            }
        >
            <div id="event-container">
                <Card
                    title={<h2 style={{fontSize: '24px'}}>{foundEvent.name}</h2>}
                    extra={<EventTag
                        eventType={foundEvent.eventType}
                    />}
                    style={{
                        color: "#27187e"
                    }}
                >
                    <p  className='txt' ><strong>Date: </strong>{foundEvent.date}</p>
                    <p  className='txt' ><strong>Location: </strong>{foundEvent.address}</p>
                    <p  className='txt' ><strong>Department: </strong>{foundEvent.departmentId}</p>
                    <p  className='txt' ><strong>Organizer: </strong>{foundEvent.organizerId}</p>
                    <p  className='txt' ><strong>Description: </strong>{foundEvent.description}</p>
                    <input type="file" onChange={handleFileChange}/>
                    <Button onClick={handleUpload} type="primary" style={{background: "#758BFD", width:"7rem", fontSize:"1.25rem", height: "2.5rem"}}>Upload</Button>
                    { imageUrl && <img src={imageUrl} alt="Uploaded" /> }
                </Card>
            </div>
            <ErrorModal
                isOpen={errorModalIsOpen}
                onClose={() => setErrorModalIsOpen(false)}
                message={"You have already registered " + error.message || "You're successfully registered to event"}
                type="Event Registration Error"
            />
        </Spin>
    )
}

export default EventDetails;
