import {
  useEffect,
  useState
} from "react";

import {
  getProducts
} from "../services/productApi";

import ProductCard
from "../components/ProductCard";

import "../styles/Products.css";

function Products(){

    const [products, setProducts] = useState([]);

    const [loading, setLoading] =  useState(true);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("All");

    useEffect(() => {

    const fetchProducts =  async () => {

    try {

      const response =
      await getProducts();

      setProducts(
        response.data.data
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  fetchProducts();

}, []);

const categories = [
  "All",
  ...new Set(products.map((product) => product.category).filter(Boolean))
];

if (loading) {

  return <div className="page-container"><h2> Loading... </h2></div>;

}

const filteredProducts =
products.filter(
(product) => {
  const matchesSearch =
    product.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      ) ||
    product.description
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      );

  const matchesCategory =
    category === "All" ||
    product.category === category;

  return matchesSearch && matchesCategory;
}
);
return (

  <section className = "products-page page-container">

    <div className="page-header">
      <span className="eyebrow">Catalog</span>
      <h1>
        Shop Electronics
      </h1>
      <p>
        Browse production-ready CloudMart products by name or category.
      </p>
    </div>

    <div className="catalog-toolbar">
      <input
        type="text"
        placeholder="Search products"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      >
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>

    <div className="catalog-summary">
      Showing {filteredProducts.length} of {products.length} products
    </div>

    <div className="products-grid">

    {
        filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (

            <ProductCard
                key={product.id}
                product={product}
            />

        ))
      ):(
             <p>No products found</p>
      )

    }

    </div>

  </section>

);
}
export default Products;
