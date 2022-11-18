import './App.css';
import React, {useState} from 'react';
import Header from "./Components/Header/Header"
import Footer from './Components/Footer/Footer';
import HomePage from './Components/HomePage/HomePage';
import ContactForm from './Components/ContactForm/ContactForm';
import ArticlesSection from './Components/ArticlesSection/ArticlesSection';
import WriteEdit from "./Components/WriteEdit/WriteEdit"
import Edit from './Components/Edit/Edit';
import LoginRegister from "./Components/LoginRegister/LoginRegister"
import Register from './Components/Register/Register';
import RegisterProcess from './Components/RegisterProcess/RegisterProcess';
import Article from './Components/Article/Article';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import ScrollToTop from './Components/ScrollToTop';


function App() {
  const [reloader, setReloader] = useState(0)
  function refreshHeader(){
    setReloader(reloader + 1)
  }
  return (
    <Router>
      <ScrollToTop>
      <Header refresh={reloader} refresher={refreshHeader}/>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/contact' element={<ContactForm />} />
        <Route path='/articles' element={<ArticlesSection />} />
        <Route path='/writeArticle' element={<WriteEdit />} />
        <Route path='/editArticle/:article_name' element={<Edit />} />
        <Route path='/login' element={<LoginRegister refresher={refreshHeader} refresh={reloader}/>} />
        <Route path='/register' element={<Register />} />
        <Route path='/registerProcess/:id' element={<RegisterProcess refresher={refreshHeader} />} />
        <Route path='/verify/:id'  element={<RegisterProcess refresher={refreshHeader} />} />
        <Route path='/article/:article_name' element={<Article />} />
        <Route path='*' element={<Navigate to={'/'} />} />
      </Routes>
      <Footer />
      </ScrollToTop>
      </Router>
  );
}

export default App;
