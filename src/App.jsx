import { useState, useEffect } from "react"
import Header from "./components/header";
import Guitar from "./components/Guitar";
import { db } from "./data/db";

function App() {

    //INICIALIZAMOS EL ESTADO DE DATA CON LOS VALORES DE DB.JS QUE YA ESTA IMPORTADO

    const initialState = () => {
        const localStorageCart = localStorage.getItem("cart")
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data, setData] = useState(db);
    const [cart, setCart] = useState(initialState);

    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    function addToCart(item) {
        const itemExist = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExist >= 0) {
            if (cart[itemExist].quantity >= MAX_ITEMS) return
            //Hacemos una copia del estado original de carrito que es un arreglo vacio
            const updatedCart = [...cart]
            //Le aumentamos la cantidad
            updatedCart[itemExist].quantity++
            //Seteamos la cantidad
            setCart(updatedCart)
        } else {
            item.quantity = 1;
            setCart([...cart, item]);
        }
    }

    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function decreaseQuantity(id) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function clearCart(e) {
        setCart([]) //Al darle click lo volvemos a setear como un carrito vacio
    }

    return (
        <>
            {/* Aquí van a ir varios componentes */}
            <Header
                cart={cart}
                removeFromCart={removeFromCart}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                clearCart={clearCart}
            />

            <main className="container-xl mt-5">
                <h2 className="text-center">Nuestra Colección</h2>

                <div className="row mt-5">
                    {data.map((guitar) => (
                        <Guitar
                            key={guitar.id}
                            guitar={guitar}
                            setCart={setCart}
                            addToCart={addToCart}
                        />
                    ))}

                </div>
            </main>


            <footer className="bg-dark mt-5 py-5">
                <div className="container-xl">
                    <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
                </div>
            </footer>



        </>
    )
}

export default App
