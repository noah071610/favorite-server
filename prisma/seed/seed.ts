import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

const candidates = [
  {
    number: 1,
    listId: nanoid(10),
    imageSrc:
      'https://i.namu.wiki/i/8R24MjrIGoa026bUl46CZs8_dhbgL91ikgqqCKfl1DtM6k50FFBmappwmdNUt_aQgPfNwEQdwy1xnl4EcShbww.webp',
    title: '카마도 탄지로',
    description: `가족은 아버지(탄쥬로), 어머니(키에), 남동생 셋(타케오, 시게루, 로쿠타), 여동생 둘(네즈코,
          하나코)이 있다. 이들은 먼저 세상을 떠난 아버지와 네즈코를 제외하고는 모두 키부츠지 무잔의 습격으로
          사망한다. 이후 탄지로는 도깨비가 되어버린 네즈코를 인간으로 되돌리기 위해 귀살대에 입단하게 된다.`,
    pick: 8,
  },
  {
    number: 2,
    listId: nanoid(10),
    imageSrc:
      'https://i.namu.wiki/i/7GNlLmMO79bx0nouEdyv8kmpD2GKR3CiUo0UQCV9BjQigagw7Rohhy7sj8AMjfIEzQROn6l2J7QsJ3vta0aM_Q.webp',
    title: '렌고쿠 쿄주로',
    description: `귀살대 9명의 주 중 하나이며 이명은 염주(炎柱). 전집중 기본 5대 계파 중 하나인 화염의 호흡을 사용한다. 이름 한자를 풀이하면 달굴 연(煉), 옥 옥(獄), 살구 행(杏), 목숨 수(寿), 사내 랑(郞). 그의 전반적인 성격이 잘 표현된 이름 자라고 볼 수 있다.`,
    pick: 12,
  },
  {
    number: 3,
    listId: nanoid(10),
    imageSrc:
      'https://i.namu.wiki/i/AHbK9_4JobeNC3DXXffmG3oPChsPVdPTii7JnhJVElIWtz8pQqxlBOY5e9_LI10s7CV0OJOptLEEG15ProZaCg.webp',
    title: '코쵸우 시노부',
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
    pick: 2,
  },
  {
    number: 4,
    listId: nanoid(10),
    imageSrc:
      'https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDVfOTcg/MDAxNjA3MTY4MzkyMzA0.PpLENY3SQkm4SHYiH2pF8-nqda4IJcYjSxBCp5QHJ04g.eUvGPczp6Elcoi9dsW1j9VH6Bb4kURCsffF0fiob7pcg.JPEG.ty177/610e645b9cc11ff14a09331da06b0167.jpg?type=w800',
    title: '젠이츠',
    description: `최종 선별에서 살아남은 5인 중 하나로[9] 이때부터 줄곧 자신은 죽을 거라며 부정적인 말을 습관처럼 되뇌는 것이 특징이다. 까마귀를 무서워해 대신 참새를 지급받거나[10], 탄지로와 겐야의 사소한 신경전에도 겁먹는 등 소심하고 유약한 성격의 소유자임이 부각된다.`,
    pick: 22,
  },
  {
    number: 5,
    listId: nanoid(10),
    imageSrc:
      'https://blog.kakaocdn.net/dn/WGp8A/btqD1NJN902/lkK4e34JIBVG5VsrczH3h1/img.jpg',
    title: '츠유리 카나오',
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
    pick: 9,
  },
  {
    number: 6,
    listId: nanoid(10),
    imageSrc:
      'https://blog.kakaocdn.net/dn/WGp8A/btqD1NJN902/lkK4e34JIBVG5VsrczH3h1/img.jpg',
    title: '츠유리 카나오',
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
    pick: 9,
  },
  {
    number: 7,
    listId: nanoid(10),
    imageSrc:
      'https://blog.kakaocdn.net/dn/WGp8A/btqD1NJN902/lkK4e34JIBVG5VsrczH3h1/img.jpg',
    title: '츠유리 카나오',
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
    pick: 9,
  },
  {
    number: 8,
    listId: nanoid(10),
    imageSrc:
      'https://blog.kakaocdn.net/dn/WGp8A/btqD1NJN902/lkK4e34JIBVG5VsrczH3h1/img.jpg',
    title: '츠유리 카나오',
    description: `약학에 정통해서 주들 중에서 유일하게 독을 사용하여 도깨비를 죽인다. 귀살대 내에서 의료장교 역할을 하고 있으며 자신의 거처인 '나비저택'을 병동으로 사용하고 있다. 이 저택에는 각각 귀살대원은 아니지만 키요, 스미, 나호라는 아이들이 저택 사용인 겸 간호사로 일하고 있다. 귀살대 대원 중에서는 칸자키 아오이와 자신의 츠구코인 츠유리 카나오가 직속 부하로서 일하고 있다.`,
    pick: 9,
  },
];

const randomNum = (min: number, max: number) =>
  Math.floor(Math.random() * max) + min;

const generateRandomDescription = (min: number, max: number) => {
  const minWords = min; // 최소 단어 수
  const maxWords = max; // 최대 단어 수

  const loremIpsum = `누구든지 체포 또는 구속을 당한 때에는 적부의 심사를 법원에 청구할 권리를 가진다. 국회는 상호원조 또는 안전보장에 관한 조약, 중요한 국제조직에 관한 조약, 우호통상항해조약, 주권의 제약에 관한 조약, 강화조약, 국가나 국민에게 중대한 재정적 부담을 지우는 조약 또는 입법사항에 관한 조약의 체결·비준에 대한 동의권을 가진다.
    사면·감형 및 복권에 관한 사항은 법률로 정한다. 국회의 정기회는 법률이 정하는 바에 의하여 매년 1회 집회되며, 국회의 임시회는 대통령 또는 국회재적의원 4분의 1 이상의 요구에 의하여 집회된다.
    국회의원과 정부는 법률안을 제출할 수 있다. 대통령은 제4항과 제5항의 규정에 의하여 확정된 법률을 지체없이 공포하여야 한다. 제5항에 의하여 법률이 확정된 후 또는 제4항에 의한 확정법률이 정부에 이송된 후 5일 이내에 대통령이 공포하지 아니할 때에는 국회의장이 이를 공포한다.
    대법원장은 국회의 동의를 얻어 대통령이 임명한다. 민주평화통일자문회의의 조직·직무범위 기타 필요한 사항은 법률로 정한다. 의무교육은 무상으로 한다.
    대통령은 국가의 원수이며, 외국에 대하여 국가를 대표한다. 이 헌법시행 당시의 대법원장과 대법원판사가 아닌 법관은 제1항 단서의 규정에 불구하고 이 헌법에 의하여 임명된 것으로 본다.
    한 회계연도를 넘어 계속하여 지출할 필요가 있을 때에는 정부는 연한을 정하여 계속비로서 국회의 의결을 얻어야 한다. 나는 헌법을 준수하고 국가를 보위하며 조국의 평화적 통일과 국민의 자유와 복리의 증진 및 민족문화의 창달에 노력하여 대통령으로서의 직책을 성실히 수행할 것을 국민 앞에 엄숙히 선서합니다.
    공개하지 아니한 회의내용의 공표에 관하여는 법률이 정하는 바에 의한다. 정당은 법률이 정하는 바에 의하여 국가의 보호를 받으며, 국가는 법률이 정하는 바에 의하여 정당운영에 필요한 자금을 보조할 수 있다.
    법률안에 이의가 있을 때에는 대통령은 제1항의 기간내에 이의서를 붙여 국회로 환부하고, 그 재의를 요구할 수 있다. 국회의 폐회중에도 또한 같다. 광물 기타 중요한 지하자원·수산자원·수력과 경제상 이용할 수 있는 자연력은 법률이 정하는 바에 의하여 일정한 기간 그 채취·개발 또는 이용을 특허할 수 있다.`;
  const loremWords = loremIpsum.split(' ');

  // 랜덤 단어 수 생성
  const randomWordCount =
    Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;

  // 랜덤 단어로 설명 생성
  const randomDescription = Array.from(
    { length: randomWordCount },
    () => loremWords[Math.floor(Math.random() * loremWords.length)],
  ).join(' ');

  return randomDescription;
};

const postIdArr = Array.from({ length: 50 }, () => nanoid(10));

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'noahh0310@gmail.com',
        userImage: 'https://avatars.githubusercontent.com/u/74864925?v=4',
        userName: '익명',
        provider: 'local',
        password: await bcrypt.hash('123123123', 10),
      },
      {
        email: 'noah071610@gmail.com',
        userImage: 'https://avatars.githubusercontent.com/u/74864925?v=4',
        userName: 'Noah',
        provider: 'local',
        password: await bcrypt.hash('123123123', 10),
      },
    ],
  });

  await prisma.post.createMany({
    data: Array.from({ length: 3 }, (_, index) => {
      return {
        postId: postIdArr[index],
        userId: 2,
        content: JSON.stringify({
          candidates,
          layout: ['image', 'text', 'imageText'][index % 3],
          chartDescription: '차트에 대해 설명',
        }),
        popular: randomNum(0, 10),
        count: randomNum(10, 10000),
        format: 'default',
        title:
          index === 2
            ? '짧은 타타 이 틀 입니다'
            : generateRandomDescription(15, 50),
        description: ['', generateRandomDescription(8, 40)][
          Math.floor(Math.random() * 2)
        ],
        type: 'polling',
        thumbnail: `https://picsum.photos/id/${index * 10}/1200/800`,
      };
    }),
  });

  await prisma.post.createMany({
    data: Array.from({ length: 3 }, (_, index) => {
      return {
        postId: postIdArr[index + 3],
        userId: 2,
        content: JSON.stringify({
          candidates: [
            {
              listId: 'left',
              number: 1,
              imageSrc:
                'https://i.namu.wiki/i/AHbK9_4JobeNC3DXXffmG3oPChsPVdPTii7JnhJVElIWtz8pQqxlBOY5e9_LI10s7CV0OJOptLEEG15ProZaCg.webp',
              title: '코쵸우 시노부',
              pick: randomNum(250, 600),
            },
            {
              listId: 'right',
              imageSrc:
                'https://i.namu.wiki/i/AHbK9_4JobeNC3DXXffmG3oPChsPVdPTii7JnhJVElIWtz8pQqxlBOY5e9_LI10s7CV0OJOptLEEG15ProZaCg.webp',
              title: '코쵸우 시노부',
              number: 2,
              pick: randomNum(250, 600),
            },
          ],
        }),
        count: randomNum(10, 10000),
        format: 'default',
        title: index === 0 ? '짧은 텍스트' : generateRandomDescription(15, 50),
        description: ['', generateRandomDescription(8, 40)][
          Math.floor(Math.random() * 2)
        ],
        popular: randomNum(0, 10),
        type: 'contest',
        thumbnail: `https://picsum.photos/id/${index * 10}/1200/800`,
      };
    }),
  });

  await prisma.post.createMany({
    data: Array.from({ length: 3 }, (_, index) => {
      return {
        postId: postIdArr[index + 7],
        userId: 2,
        popular: randomNum(0, 10),
        content: JSON.stringify({
          candidates: [
            ...candidates,
            ...candidates,
            ...candidates,
            ...candidates,
          ].map(({ imageSrc }, t) => {
            const win = randomNum(1, 100);
            return {
              listId: nanoid(10),
              title: `${t + index + 1}번 후보`,
              imageSrc,
              win: win,
              lose: 100 - win,
              pick: randomNum(0, 100),
              number: t + 1,
            };
          }),
        }),
        count: randomNum(10, 10000),
        format: 'default',
        title: generateRandomDescription(15, 50),
        description: ['', generateRandomDescription(8, 40)][
          Math.floor(Math.random() * 2)
        ],
        type: 'tournament',
        thumbnail: `https://picsum.photos/id/${index * 10}/1200/800`,
      };
    }),
  });

  await prisma.post.createMany({
    data: Array.from({ length: 3 }, (_, index) => {
      return {
        postId: postIdArr[index + 11],
        userId: 2,
        content: JSON.stringify({
          candidates,
          layout: ['image', 'text', 'imageText'][index % 3],
          chartDescription: '차트에 대해 설명',
        }),
        popular: randomNum(0, 10),
        count: randomNum(10, 10000),
        format: 'template',
        title:
          index === 2
            ? '짧은 타타 이 틀 입니다'
            : generateRandomDescription(15, 50),
        description: ['', generateRandomDescription(8, 40)][
          Math.floor(Math.random() * 2)
        ],
        type: 'polling',
        thumbnail: `https://picsum.photos/id/${index * 10}/1200/800`,
      };
    }),
  });

  await prisma.$disconnect();
}

main().catch((error) => {
  throw error;
});
