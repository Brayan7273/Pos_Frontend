import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.Product_ID} className="border p-4 rounded-md shadow-sm">
            <h2 className="font-semibold">{p.Name}</h2>
            <p>{p.Description}</p>
            <p>${p.Price}</p>
            <Button intent="primary">Edit</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
