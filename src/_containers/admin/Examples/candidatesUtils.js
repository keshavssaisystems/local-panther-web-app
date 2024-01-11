import namor from "namor";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = 1;
  return {
    name: namor.generate({ words: 1 }),
    age: Math.floor(1 * 30),
    visits: Math.floor(1 * 100),
    progress: Math.floor(1 * 100),
    status:
      statusChance > 0.75
        ? "Accepted"
        : statusChance > 0.66
        ? "No response"
        : statusChance > 0.33
        ? "followup"
        : "onHold",
  };
};

export function makeData(len = 5553) {
  return range(len).map((d) => {
    return {
      ...newPerson(),
      children: range(10).map(newPerson),
    };
  });
}
