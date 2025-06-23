import ContactForm from './components/ContactForm'
import Hero from './components/Hero'
import Products from './components/Products'
import Features from './components/Features'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Hero />
      <Products />
      <Features />
      <ContactForm />
      <Footer />
    </div>
  )
}

export default App
