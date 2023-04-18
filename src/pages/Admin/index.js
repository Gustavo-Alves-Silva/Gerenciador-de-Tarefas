import { useState, useEffect} from 'react';
import './admin.css';

import { auth, db } from '../../firebaseConection';
import { signOut } from 'firebase/auth';
import { addDoc, collection, onSnapshot, query,  orderBy, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function Admin(){
    const [tarefaInput, setTarefaInput] = useState('');
    const [user, setUser] = useState('');
    const [edit, setEdit] = useState({});

    const [tarefas, setTarefas] = useState([]);

    useEffect(()=>{
        async function loadtarefas(){
            const userDetail = localStorage.getItem("@detailUser");
            setUser(JSON.parse(userDetail));

            if(userDetail){
                const data = JSON.parse(userDetail);

                const tarefaRef = collection(db, "tarefas")
                const q = query(tarefaRef, orderBy("created", "desc"), where("userUid", "==", data?.uid))
                const unsub = onSnapshot(q, (snapshot)=> {
                    let lista = [];

                    snapshot.forEach((doc)=>{
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })
                    console.log(lista);
                    setTarefas(lista);
                })
            }
        }
        loadtarefas();
    },[])

    async function handleRegister(e){
        e.preventDefault();

        if(tarefaInput === ''){
            alert("Digite sua tarefa");
            return;
        }

        if(edit?.id){
            handleUpdateTarefa();
            return;
        }

        await addDoc(collection(db, "tarefas"),{
            tarefa:tarefaInput,
            created: new Date(),
            userUid: user?.uid,
        })
        .then(()=>{
            console.log("Tarefa Registtrada!")
            setTarefaInput('');
        }).catch((e)=>{
            console.log("Erro ao registrar: "+e);
        })
    }

    async function handleLogout(){
        await signOut(auth);
    }

    async function deletetarefa(id){
        const docRef = doc(db, "tarefas", id)
        await deleteDoc(docRef);
    }

    function editTarefa(item){
        setTarefaInput(item.tarefa);
        setEdit(item);
    }

    async function handleUpdateTarefa(){
       const docRef = doc(db, "tarefas", edit?.id)
       await updateDoc(docRef, {
        tarefa: tarefaInput
       })
       .then(()=>{
        console.log("tarefa atualizado");
        setTarefaInput('');
        setEdit({});
       }).catch((e)=>{
        console.log("erro ao atualizar")
        setTarefaInput('');
        setEdit({});
       })
    }


    return(
        <div className='admin-container'>
            <h1>Minhas Tarefas</h1>

            <form className='form' onSubmit={handleRegister}>
                <textarea placeholder='Digite sua tarefa...'
                value={tarefaInput}
                onChange={(e) => setTarefaInput(e.target.value)}/>

                {Object.keys(edit).length > 0 ? (
                    <button className='btn-register' type='submit'>Atualizar tarefa</button>
                ) : (
                    <button className='btn-register' type='submit'>Registrar tarefa</button>
                )}
            </form>

            {tarefas.map((item)=>{               
            return(
                <article key={item.id} className='list'>
                    <p>{item.tarefa}</p>
            
                    <div>
                        <button onClick={ ()=> editTarefa(item)}>Editar</button>
                        <button onClick={ ()=> deletetarefa(item.id)} className='btn-delete'>Concluir</button>
                    </div>  
                </article>
            )
            })}

            <button className='btn-logout' onClick={handleLogout}>Sair</button>
        </div>
    )
}