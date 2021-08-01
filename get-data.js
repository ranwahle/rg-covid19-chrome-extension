const neighborhoodPopulation = [
  { name: "שיכון ותיקים", value: 4807 },
  { name: "נחלת גנים", value: 3551 + 4793 },
  { name: "שכונת גפן", value: 2806 + 3976 },
  { name: "תל בנימין", value: 3661 + 2613 + 298 },
  { name: "שכונת ראשונים", value: 2809 + 2449 },
  { name: "הבורסה", value: 751 },
  { name: "חרוזים", value: 3179 },
  { name: "שכונת חשמונאים", value: 5746 },
  { name: "שכונת יהלום", value: 3878 + 2207 },
  { name: "שכונת בן גוריון", value: 2688 + 4498 + 4316 },
  { name: "שכונת הלל", value: 4316 + 3493 },
  { name: "יד לבנים", value: 3302 + 2396 },
  { name: "תל יהודה", value: 6124 + 5218 },
  { name: "מתחם נגבה", value: 3814 + 6611 },
  { name: "קריית בורוכוב", value: 4513 },
  { name: 'אזור הבילויי"ם', value: 4390 + 3333 },
  { name: "מרום נווה", value: 3220 + 4745 },
  { name: "שיכון מזרחי", value: 3778 + 2472 },
  { name: "רמת עמידר", value: 5234 + 3155 },
  { name: "בר אילן", value: 388 },
  { name: "גני ערמונים", value: 5852 },
  { name: "נווה יהושע", value: 5272 },
  { name: "רמת חן", value: 6411 },
  { name: "רמת שקמה", value: 6411 },
  { name: "שיכון צנחנים", value: 106 },
  { name: "קרית קריניצי", value: 4155 },
  { name: "תל השומר", value: 488 },
  { name: "רמת אפעל", value: 3272 },
  { name: 'כפר אז"ר', value: 488 },
];
const loadData = async () => {
  const response = await fetch(
    "https://www.ramat-gan.muni.il/covid19/__svws__/SvService.asmx/GetCovidData",
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language":
          "en,he;q=0.9,ar;q=0.8,en-GB;q=0.7,en-US;q=0.6,es;q=0.5,fr;q=0.4",
        "cache-control": "no-cache",
        "content-type": "application/json; charset=utf-8",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      body: null,
      method: "POST",
    }
  );
  const rawData = await response.json();

  const neighborhoods = rawData.d.ActiveCasesByNeighborhoodStatistics;

  return neighborhoods;
};
const activeCases = "מקרים פעילים";
const aDatBefore = "שינוי יום קודם";
const addOption = (text, value) => {
  const option = document.createElement("option");
  option.setAttribute("value", value);
  option.textContent = text;
  return option;
};

const getData = async () => {
  document.querySelector('.neighborhood-map_text').style.textAlign = 'right';
  document.querySelector('.neighborhood-map_text span').textContent += ' נתוני אוכלוסיית השכונות נלקחו מאתר הלשכה המרכזית לסטטיסטיקה'
  const bar = document.querySelector("ul.piotabs-list");

  const li = document.createElement("li");
  li.classList.add("piotabs-tab");
  const selectBox = document.createElement("select");
  li.appendChild(selectBox);

  selectBox.append(addOption("מקרים פעילים", "activeCases"));
  selectBox.append(addOption("מקרים לאלף תושבים", "activeCasesPerPopulation"));
  selectBox.append(addOption("שינוי מיום קודם", "casesDelta"));

  li.style.cursor = "pointer";
  bar.appendChild(li);

  selectBox.onchange = () => showValues(selectBox.value);

  const neighborhoods = await loadData();

  const neighborhoodsElements = document.querySelectorAll(
    "g[data-neighborhood]"
  );

  const showValuesPerPopulation = () => {
    const tupples = findNumberElements(neighborhoodsElements);
    tupples.forEach(({ span, neighborhood }) => {
      const singleNeighborhoodPopulation = neighborhoodPopulation.find(
        (n) => n.name === neighborhood.Name
      );

      const newValue = singleNeighborhoodPopulation
        ? Math.round(
            (neighborhood.Value * 1000) / singleNeighborhoodPopulation.value
          )
        : "?";
      span.textContent = `${newValue}`;
    });
  };

  const showValue = () => {
    //  li.textContent = activeCases;
    const tupples = findNumberElements(neighborhoodsElements);
    tupples.forEach(({ span, neighborhood }) => {
      span.textContent = `${neighborhood.Value}`;
    });
  };

  const findNumberElements = (elements) => {
    return Array.from(elements).map((element) => {
      const id = element.getAttribute("data-neighborhood");

      const neighborhood = neighborhoods.find((n) => n.ID === +id);

      const span = element.querySelector('text[font-size="20"] tspan');

      return { span, neighborhood };
    });
  };

  const showDelta = async () => {
    const tupples = findNumberElements(neighborhoodsElements);
    tupples.forEach(({ span, neighborhood }) => {
      const newValue =
        neighborhood.Delta > 0 ? `+${neighborhood.Delta}` : neighborhood.Delta;
      span.textContent = newValue;
    });
  };

  const selectCasesDict = {
    casesDelta: showDelta,
    activeCasesPerPopulation: showValuesPerPopulation,
    activeCases: showValue,
  };

  const showValues = (value) => {
    selectCasesDict[value]();
  };
};

getData();
