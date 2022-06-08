
export default async function handler(req, res) {

  let allDataInJson = [];

  const allURLs = [
    "https://fotuk.in/json/burger.json",
    "https://fotuk.in/json/chicken.json",
    "https://fotuk.in/json/chickenWings.json",
    "https://fotuk.in/json/paneerRoll.json",
    "https://fotuk.in/json/pizza.json",
    "https://fotuk.in/json/sandwich.json"
  ]

  for (let k = 0; k < allURLs.length; k++) {
    const res = await fetch(allURLs[k]);
    const body = await res.json()
    // console.log("Body", body);
    allDataInJson.push(body);
}
console.log("All Data in Json", allDataInJson);

// return allDataInJson
    res.json(allDataInJson);

    // res.status(200).json({ name: 'John Doe' })
  }
  