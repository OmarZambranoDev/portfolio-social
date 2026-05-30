import { User, Post, Follow } from '../types/social';

const MOCK_CONTENT = [
  'Just finished building a micro-frontend architecture demo. Module Federation is incredible when it works.',
  'TypeScript has completely changed how I write code. The confidence it gives me during refactors is unmatched.',
  "Tailwind CSS is my go-to for styling now. Haven't written a custom CSS file in months.",
  'Spent the day debugging a CORS issue. Turns out it was a typo in the server URL. Always the small things.',
  'React Server Components are a game changer. The mental model shift is worth the learning curve.',
  'Finally got my CI/CD pipeline green after 47 commits. The satisfaction is real.',
  'Hot take: tabs are better than spaces. Fight me.',
  "Just discovered a new VS Code extension that saved me hours of work. Why didn't I find this sooner?",
  'Dark mode everything. My eyes thank me every day.',
  'Working with WebSockets today. Real-time features are so satisfying to build.',
  'The best code is no code. The second best is deleted code.',
  'Spent 3 hours optimizing a query. Went from 2.1s to 47ms. Worth it.',
  'Learning Rust on the weekends. The borrow checker and I are not friends yet.',
  "CSS Grid solved problems I didn't even know I had.",
  'Just shipped a feature that I started 3 months ago. The feeling never gets old.',
  "Coffee and coding — name a more iconic duo. I'll wait.",
  "Accessibility isn't optional. It's a fundamental part of good web development.",
  "Monorepos are amazing until they're not. The tooling is getting better though.",
  'Pair programming session today was super productive. Two minds really are better than one.',
  'Just refactored a 500-line component into 5 smaller ones. So much cleaner.',
  "The hardest part of coding isn't the code — it's naming things.",
  'Docker has saved my sanity more times than I can count.',
  'GraphQL is great until you have to optimize the resolvers.',
  "Added error boundaries to my React app today. Why didn't I do this months ago?",
  "Sometimes the best debugging tool is a good night's sleep.",
  'Zustand is so refreshingly simple compared to Redux. Less boilerplate, same power.',
  'Working on a side project that uses AI APIs. The future is wild.',
  'Just gave a tech talk on micro-frontends. The Q&A was intense but fun.',
  'Testing is not optional. Your future self will thank you.',
  'The amount of JavaScript fatigue is real, but the ecosystem keeps improving.',
];

const MOCK_USERS: Omit<User, 'id'>[] = [
  {
    name: 'Alex Chen',
    bio: 'Full-stack developer passionate about React and Node.js. Building cool stuff on the web since 2018.',
    avatar: 'https://picsum.photos/seed/alexchen/200',
  },
  {
    name: 'Sarah Johnson',
    bio: 'UX engineer bridging design and development. Accessibility advocate and CSS enthusiast.',
    avatar: 'https://picsum.photos/seed/sarahjohnson/200',
  },
  {
    name: 'Mike Rodriguez',
    bio: 'Backend developer specializing in distributed systems. Go and Rust enthusiast. Open source contributor.',
    avatar: 'https://picsum.photos/seed/mikerodriguez/200',
  },
  {
    name: 'Emily Park',
    bio: 'Mobile developer focusing on React Native. Coffee addict and hackathon organizer.',
    avatar: 'https://picsum.photos/seed/emilypark/200',
  },
  {
    name: 'David Kim',
    bio: 'DevOps engineer automating everything. Kubernetes enthusiast and homelab tinkerer.',
    avatar: 'https://picsum.photos/seed/davidkim/200',
  },
  {
    name: 'Lisa Thompson',
    bio: 'Data scientist turned frontend developer. Love creating beautiful data visualizations with D3.',
    avatar: 'https://picsum.photos/seed/lisathompson/200',
  },
  {
    name: 'James Wilson',
    bio: 'Startup CTO building products from 0 to 1. Full-stack with a focus on developer experience.',
    avatar: 'https://picsum.photos/seed/jameswilson/200',
  },
  {
    name: 'Maria Garcia',
    bio: 'QA engineer who breaks things for a living. Passionate about test automation and quality culture.',
    avatar: 'https://picsum.photos/seed/mariagarcia/200',
  },
  {
    name: 'Chris Taylor',
    bio: 'Frontend architect designing component libraries. Design systems are my love language.',
    avatar: 'https://picsum.photos/seed/christaylor/200',
  },
  {
    name: 'Anna Lee',
    bio: 'Junior developer documenting my coding journey. Sharing what I learn every day.',
    avatar: 'https://picsum.photos/seed/annalee/200',
  },
  {
    name: 'Tom Brown',
    bio: 'Game developer exploring web technologies. Building multiplayer experiences with WebSockets.',
    avatar: 'https://picsum.photos/seed/tombrown/200',
  },
  {
    name: 'Rachel Green',
    bio: 'Tech lead managing a remote team across 4 time zones. Writing about leadership and architecture.',
    avatar: 'https://picsum.photos/seed/rachelgreen/200',
  },
  {
    name: 'Daniel Martinez',
    bio: 'Security researcher focused on web application security. Bug bounty hunter in my free time.',
    avatar: 'https://picsum.photos/seed/danielmartinez/200',
  },
  {
    name: 'Jessica White',
    bio: 'API developer designing RESTful services. Documentation is my superpower.',
    avatar: 'https://picsum.photos/seed/jessicawhite/200',
  },
  {
    name: 'Ryan Adams',
    bio: 'Blockchain developer building DeFi applications. Web3 enthusiast and Solidity developer.',
    avatar: 'https://picsum.photos/seed/ryanadams/200',
  },
  {
    name: 'Amanda Clark',
    bio: 'Tech writer and developer advocate. Translating complex concepts into clear documentation.',
    avatar: 'https://picsum.photos/seed/amandaclark/200',
  },
  {
    name: 'Kevin Nguyen',
    bio: 'Performance engineer optimizing web applications. Millisecond matters.',
    avatar: 'https://picsum.photos/seed/kevinnguyen/200',
  },
  {
    name: 'Olivia Brown',
    bio: 'AI/ML engineer exploring the intersection of machine learning and web development.',
    avatar: 'https://picsum.photos/seed/oliviabrown/200',
  },
  {
    name: 'Jason Patel',
    bio: 'Freelance developer working with startups worldwide. Digital nomad since 2020.',
    avatar: 'https://picsum.photos/seed/jasonpatel/200',
  },
  {
    name: 'Sophia Turner',
    bio: 'Backend developer who loves databases. PostgreSQL is my happy place.',
    avatar: 'https://picsum.photos/seed/sophiaturner/200',
  },
];

const CURRENT_USER: User = {
  id: 'current-user',
  name: 'You',
  bio: 'Building a micro-frontend portfolio project with host and remote applications. Learning Module Federation and sharing components across apps.',
  avatar: 'https://picsum.photos/seed/currentuser/200',
};

const YOUR_SEED_POSTS = [
  'Working on my micro-frontend portfolio project! Setting up the host app and configuring Module Federation for the Vite remotes.',
  'Just got the social feed micro-frontend working with the host. The remote app loads dynamically — so cool to see it in action!',
  'Debugging shared dependencies between the host and remote apps. Zustand state management is working great across the federated modules.',
  'The portfolio is coming together! Got the UI library shared across all apps. Check out the host: https://github.com/OmarZambranoDev/portfolio-landing-vite and the remotes: https://github.com/OmarZambranoDev/portfolio-music, https://github.com/OmarZambranoDev/portfolio-trade',
  'Module Federation is powerful but the configuration has to be just right. Learning a lot about how Vite handles federated modules.',
  'Just wrapped up the Trade app — stock charts with lightweight-charts, mock WebSocket for real-time prices, and a full portfolio tracker. Three remotes down!',
  'Version enforcement is saving me hours of debugging. Every remote checks against the host versions.json before building. No more React version mismatches.',
  'Earth theme color palette is consistent across all four apps now. The shared UI library with Radix primitives was the right call.',
  'Thinking about the next apps — Shop with routing, Travel with multi-step forms, News with markdown rendering. Going to use Next.js for those to round out the resume.',
  'Just added the Avatar component to the shared UI library. Needed it for the Social app, but it will be reused across all the upcoming apps too.',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset<T>(arr: T[], min: number, max: number): T[] {
  const count = randomInt(min, max);
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

let idCounter = 0;
function generateId(): string {
  return `${Date.now()}-${idCounter++}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateUsers(): User[] {
  const users = MOCK_USERS.map((u, i) => ({
    ...u,
    id: `user-${i + 1}`,
  }));
  return [CURRENT_USER, ...users];
}

export function generateFollows(users: User[]): Follow[] {
  const follows: Follow[] = [];
  const addedPairs = new Set<string>();

  const addFollow = (followerId: string, followingId: string) => {
    const pairKey = `${followerId}-${followingId}`;
    if (!addedPairs.has(pairKey)) {
      addedPairs.add(pairKey);
      follows.push({ followerId, followingId });
    }
  };

  // "You" follows exactly 5 users
  const youFollows = randomSubset(users.slice(1), 5, 5);
  youFollows.forEach((f) => addFollow(CURRENT_USER.id, f.id));

  // Other users follow 3-8 users each
  users.slice(1).forEach((user) => {
    const followCount = randomInt(3, 8);
    const potentialFollows = users.filter((u) => u.id !== user.id);
    const follows_ = randomSubset(potentialFollows, followCount, followCount);
    follows_.forEach((f) => addFollow(user.id, f.id));
  });

  return follows;
}

export function generatePosts(users: User[]): Post[] {
  const now = Date.now();
  const fortyEightHours = 48 * 60 * 60 * 1000;
  const posts: Post[] = [];

  YOUR_SEED_POSTS.forEach((content, i) => {
    const post: Post = {
      id: `post-you-${i + 1}`,
      userId: CURRENT_USER.id,
      content,
      timestamp: now - randomInt(0, fortyEightHours),
      likes: [],
      comments: [],
    };

    const likers = randomSubset(users.slice(1), 0, 5);
    post.likes = likers.map((u) => u.id);

    const commentCount = randomInt(0, 3);
    for (let j = 0; j < commentCount; j++) {
      const commenter = randomElement(users);
      post.comments.push({
        id: generateId(),
        userId: commenter.id,
        content: randomElement(MOCK_CONTENT.slice(0, 10)),
        timestamp: post.timestamp + randomInt(60000, 3600000),
      });
    }

    posts.push(post);
  });

  for (let i = 0; i < 50; i++) {
    const author = randomElement(users);
    const post: Post = {
      id: `post-${i + 1}`,
      userId: author.id,
      content: randomElement(MOCK_CONTENT),
      timestamp: now - randomInt(0, fortyEightHours),
      likes: [],
      comments: [],
    };

    const likers = randomSubset(users, 0, 5);
    post.likes = likers.map((u) => u.id);

    const commentCount = randomInt(0, 3);
    for (let j = 0; j < commentCount; j++) {
      const commenter = randomElement(users);
      post.comments.push({
        id: generateId(),
        userId: commenter.id,
        content: randomElement(MOCK_CONTENT.slice(10)),
        timestamp: post.timestamp + randomInt(60000, 3600000),
      });
    }

    posts.push(post);
  }

  return posts.sort((a, b) => b.timestamp - a.timestamp);
}

export function generateAllData() {
  const users = generateUsers();
  const follows = generateFollows(users);
  const posts = generatePosts(users);
  return { users, follows, posts };
}
