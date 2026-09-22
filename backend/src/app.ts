// src/app.ts
import "dotenv/config";

const query = `
  query {
    products {
      id
      name
      salePrice
      currentQuantity
    }
  }
`;

const res = await fetch("http://localhost:8081/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
});

const json = await res.json();
console.log(JSON.stringify(json, null, 2));