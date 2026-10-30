import React from 'react'
import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
    return (
        <div className='footer'>
            <p>Copyright © 2024. kmc63trading (002944165P / 201903066683) All right reserved</p>
            <ul>
                <li>Terms of Service</li>
                <li>Privacy policy</li>
            </ul>
            <div className='social-icons'>
                <a href="https://www.instagram.com/kmc63_bakingtray/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61558628079399" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="https://wa.me/60129802762" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faWhatsapp} />
                </a>
                <a href="https://www.google.com/maps/place/KMC+63+Trading/@3.0389174,101.7488713,15z/data=!4m6!3m5!1s0x31cc3543def799d1:0x4badda68a84593da!8m2!3d3.0389174!4d101.7488713!16s%2Fg%2F11vx64wxn1?hl=en&entry=ttu" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                </a>
            </div>
        </div>
    )
}

export default Footer
