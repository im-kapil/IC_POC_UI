import useSWR from "swr";
import axios from "axios";
// import React, { useState } from 'react';

const fetcher = (url) => axios.get(url).then(response => response.data);

// console.log("My data" ,data)

export default function Fetch() {

  const { data, error } = useSWR(__dirname+"api/getdata", fetcher)

  if (error) {
    return (<p>{error.message}</p>)
  }
  if (!data) {
    return (<p>Loading....</p>)
  }

  console.log(data);

  return (
    <div>
      <h1>All Menu Items</h1>

      {/* <div>
     {
      JSON.stringify(data , null , 2)      
     }
     </div> */}

      <div>
        {
          data.map((items) =>
            <div>
              <img src={items.Image} ></img>
              <h1>Name: {JSON.stringify(items.Name)}</h1>
              <h4>Description: {JSON.stringify(items.Description)}</h4>
              <h4>Price: {JSON.stringify(items.Price)}</h4>
              <h4>Brand: {JSON.stringify(items.Brand)}</h4>
            </div>
          )
        }
      </div>

    </div>
  )
}

