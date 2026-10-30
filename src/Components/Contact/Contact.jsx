import React from 'react'
import './Contact.css'
import msg_icon from '../../Assets/mail.png'
import mailicon from '../../Assets/email.png'
import phoneIcon from '../../Assets/telephone-call.png'
import locaIcon from '../../Assets/location.png'
import whiteArrow from '../../Assets/whiteArrow.png'

const Contact = () => {
    const [result, setResult] = React.useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending....");
        const formData = new FormData(event.target);

        formData.append("access_key", "b5e32b6b-abd4-4f28-be35-f0e7171a8cdc");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult("Form Submitted Successfully");
            event
                .target
                .reset();
        } else {
            console.log("Error", data);
            setResult(data.message);
        }
    };

    return (
        <div className='contact'>
            <div className="contact-col">
                <h3>Send us message
                    <img src={msg_icon} alt=""/>
                </h3>
                <p>Feel free to reach us
                </p>
                <ul>
                    <li><img src={mailicon} alt=""/>
                        kmc63trading@gmail.com</li>
                    <li><img src={phoneIcon} alt=""/>
                        +60129802762</li>
                    <li><img src={locaIcon} alt=""/>
                        No.1, Jalan Com Industrial Park2/1, Com Industrial Park 2, kawasan Perindustrian
                        Kg.Baru Balakong, 43300 Seri Kembangan, Selangor Darul Ehsan. Malaysia</li>
                    <li>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m22!1m8!1m3!1d3984.20780118723!2d101.74628347497074!3d3.038879646936964!3m2!1i1024!2i768!4f13.1!4m11!3e6!4m3!3m2!1d3.0388401999999997!2d101.74874369999999!4m5!1s0x31cc3543def799d1%3A0x4badda68a84593da!2skmc63trading!3m2!1d3.0389174!2d101.74887129999999!5e0!3m2!1sen!2smy!4v1717744066121!5m2!1sen!2smy"
                            width="400"
                            height="300"
                            style={{border:0}}
                            allowfullscreen
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </li>
                </ul>
            </div>
            <div className="contact-col">
                <form onSubmit={onSubmit}>
                    <label>Your name
                    </label>
                    <input
                        type="text"
                        name='name'
                        placeholder='Enter your name'
                        required="required"/>
                    <label>Phone number
                    </label>
                    <input
                        type="tel"
                        name='phone'
                        placeholder='Enter your mobile number'
                        required="required"/>
                    <label>Write your message here</label>
                    <textarea
                        name="message"
                        rows="6"
                        placeholder='Enter your message'
                        required="required"></textarea>
                    <button type='submit' className='btn dark-btn'>Submit now
                        <img src={whiteArrow} alt=""/></button>
                </form>
                <span>{result}</span>
            </div>
        </div>
    )
}

export default Contact
