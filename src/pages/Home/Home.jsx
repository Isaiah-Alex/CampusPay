import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero'
import Title from '../../components/Title/Title'
import Card from '../../components/Card/Card'
import Register_icon from '../../assets/Register-logo.svg'
import Deposit_icon from '../../assets/Deposit logo.svg'
import Payment_icon from '../../assets/payment-logo.svg'
import Transaction_icon from '../../assets/Transaction-logo.svg'
import For from '../../components/For/For'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  return (
    <div className='home'>
      <div className="navbar-container">
      <Navbar/>
      </div>
        <div className="hero-container">
      <Hero/>
      </div>
      <Title  title={'How it Works'} />
      <div className="home-cards">
        <Card description={'Register/ Connect Wallet'} icon={Register_icon}/>
        <Card description={'Deposit/ Top-Up'} icon={Deposit_icon}/>
        <Card description={'Pay Or Receive Payment'} icon={Payment_icon}/>
        <Card description={'Track Transaction'} icon={Transaction_icon}/>
      </div>
      <For/>
      <Footer/>

    </div>
  )
}

export default Home