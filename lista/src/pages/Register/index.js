 import { useState } from "react"
  
  import { Link } from "react-router-dom";
  import { auth } from '../../firebaseConection';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { useNavigate } from "react-router-dom";
   
  export default function Register(){
      const [email,setEmail] = useState('');
      const [password,setPassword] = useState('');

      const navigate = useNavigate();
  
      
  async function handleRegister(e){
      e.preventDefault();
  
      if(email !== '' && password !== ''){
          await createUserWithEmailAndPassword(auth,email,password)
          .then(()=>{
            navigate('/admin',{replace: true})
            setEmail('');
            setPassword('');
          })
          .catch(()=>{
            console.log("error ao fazer um cadastro")
            setEmail('');
            setPassword('');
          })

      }else{
          alert("preencha todos os campos");
      }
      
  
  }
  
      return(
        <div className="home-container">
          <h1>Cadastre-se</h1>
          <span>Vamosc criar sua conta</span>
  
          <form className="form" onSubmit={handleRegister}>
  
              <input type="text"
              placeholder="Digite o seu email..."
              value={email}
              onChange={(e)=> setEmail(e.target.value) }/>
  
              <input
              type="password"
              placeholder="******"
              value={password}
              onChange={(e)=> setPassword(e.target.value) }/>
  
              <button type="submit">Cadastrar</button>
          </form>
  
          <Link className="button-link" to="/">
              Já possui uma conta? Faça login
          </Link>
        </div>
      )
    }