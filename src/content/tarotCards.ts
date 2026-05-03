export type TarotCardData = {
  id: string;
  number: number;
  title: string;
  keyword: string;
  image: string;
  message: string;
};

export const tarotCards: TarotCardData[] = [
  {
    id: "01-the-magician",
    number: 1,
    title: "마법사의 카드",
    keyword: "마음을 전하는 힘",
    image: "/assets/tarrotcard/01_the_magician_a.png",
    message: "마법사의 카드는 마음을 행동으로 바꾸는 힘을 말해. 오늘은 다정한 말 하나가 작은 주문처럼 통할 거야.",
  },
  {
    id: "03-the-empress",
    number: 3,
    title: "여황제의 카드",
    keyword: "따뜻한 애정",
    image: "/assets/tarrotcard/03_the_empress_a.png",
    message: "여황제의 카드는 편안하게 안아주는 애정을 보여줘. 오늘은 부드럽게 챙겨주는 마음이 가장 크게 빛나.",
  },
  {
    id: "06-the-lovers",
    number: 6,
    title: "연인의 카드",
    keyword: "서로를 선택하는 마음",
    image: "/assets/tarrotcard/06_the_lovers_a.png",
    message: "연인의 카드는 결국 서로를 다시 선택하는 마음이야. 작은 확신을 말로 꺼내면 관계가 더 반짝여.",
  },
  {
    id: "10-wheel-of-fortune",
    number: 10,
    title: "운명의 수레바퀴",
    keyword: "좋은 타이밍",
    image: "/assets/tarrotcard/10_wheel_of_fortune_a.png",
    message: "운명의 수레바퀴는 지금이 좋은 타이밍이라고 속삭여. 미뤄둔 말이 있다면 오늘 꺼내도 좋아.",
  },
  {
    id: "14-temperance",
    number: 14,
    title: "절제의 카드",
    keyword: "서로 맞춰가는 균형",
    image: "/assets/tarrotcard/14_temperance_a.png",
    message: "절제의 카드는 둘이 서로의 속도에 맞춰가는 균형을 말해. 천천히, 하지만 진심으로 다가가면 돼.",
  },
  {
    id: "17-the-star",
    number: 17,
    title: "별의 카드",
    keyword: "희망과 위로",
    image: "/assets/tarrotcard/17_the_star_a.png",
    message: "별의 카드는 조용한 위로와 희망이야. 오늘 네 말이 상대에게 작은 불빛처럼 닿을 수 있어.",
  },
  {
    id: "19-the-sun",
    number: 19,
    title: "태양의 카드",
    keyword: "환한 기쁨",
    image: "/assets/tarrotcard/19_the_sun_a.png",
    message: "태양의 카드는 숨기지 않는 기쁨을 뜻해. 밝게 웃고 솔직하게 표현하면 오늘 분위기가 따뜻해질 거야.",
  },
  {
    id: "21-the-world",
    number: 21,
    title: "세계의 카드",
    keyword: "완성되는 마음",
    image: "/assets/tarrotcard/21_the_world_a.png",
    message: "세계의 카드는 함께 만든 시간이 예쁘게 완성되어 간다는 뜻이야. 오늘의 기념일에 아주 잘 어울리는 카드야.",
  },
];
