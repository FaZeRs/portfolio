import { db } from "~/server/db";
import { experiences, projects } from "./schema";

const main = async () => {
  const experience_data: (typeof experiences.$inferInsert)[] = [
    {
      title: "Commercial Services",
      organization: "PIKC LVT",
      website: "https://www.lvt.lv/",
      startDate: new Date("2011-09-01"),
      endDate: new Date("2015-06-21"),
      onGoing: false,
      logoUrl:
        "https://storage.naurislinde.dev/portfolio-public/1678129598781-unnamed%20copy%20copy%20copy.svg",
      published: true,
    },
    {
      title: "Information Technology",
      organization: "Riga Technical University",
      website: "https://www.rtu.lv/en",
      startDate: new Date("2015-09-01"),
      endDate: new Date("2017-06-21"),
      onGoing: false,
      logoUrl:
        "https://storage.naurislinde.dev/portfolio-public/1678129580999-RTU_logo_2017.svg",
      published: true,
    },
    {
      title: "Backend Web Developer",
      organization: "Sem.lv",
      website: "https://sem.lv/en",
      startDate: new Date("2016-08-01"),
      endDate: new Date("2019-01-21"),
      onGoing: false,
      logoUrl:
        "https://storage.naurislinde.dev/portfolio-public/1678129564002-sem_logo.svg",
      published: true,
    },
    {
      title: "C++ Developer",
      organization: "Giraffe360",
      website: "https://www.giraffe360.com",
      startDate: new Date("2019-01-21"),
      onGoing: true,
      logoUrl:
        "https://storage.naurislinde.dev/portfolio-public/1678129545871-logo_black.d089f2ff%20copy%20copy.svg",
      published: true,
    },
  ];

  const project_data: (typeof projects.$inferInsert)[] = [
    {
      title: "Tiger Tracking",
      shortDescription: "Android/iOS application for time tracking",
      description:
        "Tiger Tracking is an intuitive and user-friendly mobile app available for both Android and iOS platforms. Built using VueJS and Nativescript, it allows users to easily track their workday by starting and finishing their workday, as well as check-in when they have reached their destination. The app features an easy-to-use interface, enabling users to quickly start and end their workday with just a few taps. Users can also view a list of previous entries, giving them a clear overview of their work history. One of the most powerful features of this app is its location tracking functionality. Users can easily check-in when they arrive at their destination, providing accurate location data to help them stay on top of their work schedule.",
      status: "completed",
      published: true,
      thumbnailUrl:
        "https://storage.naurislinde.dev/portfolio-public/1678130153992-main.png",
    },
    {
      title: "Pie Oļega",
      shortDescription:
        "Ecommerce platform for the automotive and auto-parts industy",
      description:
        "The ecommerce platform for the automotive and auto-parts industry is a comprehensive solution that allows businesses to easily manage their online presence and sell their products to customers worldwide. The platform is composed of a frontend application and a CMS, both utilizing modern technologies to provide a seamless user experience. The frontend application is built using VueJS, NuxtJS, and Bootstrap, which provides a responsive and intuitive interface for customers to browse and purchase products. The use of VueJS and NuxtJS allows for a highly optimized and performant website, while Bootstrap provides a sleek and customizable design. On the other hand, the CMS is built using PHP and Laravel, which offers a robust and flexible backend for managing product listings, orders, and customer data. The use of Laravel ensures that the CMS is highly secure, scalable, and efficient, while PHP provides a wide range of functionalities to manage and process data. To support the platform's performance and scalability, additional tech stack includes Minio, Meilisearch, Redis, Traefik, and MySQL. Minio provides a highly scalable and distributed object storage system, while Meilisearch offers a powerful search engine that can efficiently search through large sets of data. Redis is used as a cache to speed up database queries and minimize response times, while Traefik is utilized as a load balancer and reverse proxy to handle incoming traffic. Finally, MySQL is used as the primary database to store all the essential data needed for the platform to function. Overall, the ecommerce platform for the automotive and auto-parts industry provides a comprehensive and efficient solution that allows businesses to expand their online presence and reach a wider audience. With its advanced technologies and robust features, the platform offers an exceptional user experience, making it the perfect choice for any automotive or auto-parts business looking to thrive in the digital world.",
      status: "completed",
      published: true,
      thumbnailUrl:
        "https://storage.naurislinde.dev/portfolio-public/1678130001361-Screenshot%202022-11-11%20at%2014-00-52%20S%C3%84%C2%81kums%20Pie%20O%C3%84%C2%BCega.png",
    },
    {
      title: "Pūķarags",
      shortDescription: "Booking platform for camping ground businesses",
      description:
        "The booking platform for a recreation complex is a comprehensive solution designed to simplify and streamline the process of booking recreational facilities and services. The platform consists of a Frontend application and a CMS, both of which are built using state-of-the-art technologies to ensure seamless user experience and high performance. The Frontend application is built using VueJS, NuxtJS, and Bootstrap. VueJS is a popular JavaScript framework that enables the creation of dynamic and responsive user interfaces. NuxtJS is a server-side rendering framework for VueJS that optimizes the performance and SEO of the application. Bootstrap is a front-end framework that provides a responsive and mobile-first design system. The CMS, on the other hand, is built using PHP and Laravel. Laravel is a powerful PHP framework that enables developers to build robust and scalable web applications. It provides a wide range of features such as routing, middleware, and authentication, which are essential for building a CMS. PHP is a widely-used programming language that is suitable for building web applications of all sizes. To ensure fast and reliable data storage and retrieval, the platform uses Minio, Meilisearch, Redis, and MySQL. Minio is a high-performance object storage system that is designed for modern applications. Meilisearch is a powerful search engine that enables fast and relevant search results. Redis is an in-memory data store that is used for caching frequently accessed data. MySQL is a popular open-source relational database management system that is used for storing and retrieving data. To ensure high availability and scalability, the platform uses Docker and Traefik. Docker is a containerization platform that enables the creation and deployment of applications in lightweight and portable containers. Traefik is a modern reverse proxy and load balancer that is designed for microservices. Overall, the booking platform for a recreation complex is a powerful and comprehensive solution that leverages the latest technologies to provide a seamless and intuitive user experience.",
      status: "completed",
      published: true,
      thumbnailUrl:
        "https://storage.naurislinde.dev/portfolio-public/1678130106768-Screenshot%202022-11-11%20at%2014-10-42%20S%C3%84%C2%81kums.png",
    },
    {
      title: "Baltic Probiotics",
      shortDescription: "Ecommerce platform for the bio-industy",
      description:
        "This platform consists of a frontend application and a CMS to provide a seamless and intuitive user experience for both customers and administrators. The frontend application is built using VueJS, NuxtJS, and Bootstrap, which allows us to create responsive and interactive interfaces that are optimized for speed and performance. Our frontend is designed to provide a visually appealing and user-friendly experience that showcases the products, news and information about compnay. The CMS is built using PHP and Laravel, which provides a robust and scalable framework for managing the backend of our platform. This allows us to easily manage the content, products, and services offered by our clients, as well as handle transactions and customer interactions. To enhance the performance and scalability of our platform, we utilize a number of additional technologies, including Minio, Meilisearch, Redis, Traefik, MySQL, and Docker. Minio is a distributed object storage system that allows us to easily store and retrieve large amounts of data. Meilisearch is a fast and powerful search engine that enables us to provide accurate and relevant search results for our customers. Redis is an in-memory data store that enables us to cache data and improve the performance of our platform. Traefik is a modern reverse proxy and load balancer that helps us manage traffic and ensure high availability. MySQL is a widely-used database management system that provides reliability and scalability for our platform. Finally, Docker is a containerization technology that enables us to deploy and manage our platform across multiple environments with ease. This ecommerce platform for the bio-industry is a powerful and flexible solution that enables our clients to showcase their products and services and engage with their customers in a streamlined and efficient manner.",
      status: "completed",
      published: true,
      thumbnailUrl:
        "https://storage.naurislinde.dev/portfolio-public/1678130044653-Screenshot%202022-11-11%20at%2014-07-34%20ProbioSewage%20-%20notek%C3%85%C2%ABde%C3%85%C2%86iem%20kanaliz%C3%84%C2%81cijai%201L.png",
    },
    {
      title: "Portfolio",
      shortDescription: "Portfolio platform for software developers",
      description:
        "The portfolio platform is a comprehensive solution that allows users to create, manage and showcase their portfolio in an easy and user-friendly way. The platform consists of a frontend application and a REST API, each using different technologies to ensure optimal performance and functionality. The frontend application is built using VueJS, ViteJS and UnoCSS, which are some of the most popular and powerful frontend technologies in the industry. This ensures that the platform's frontend is fast, responsive and user-friendly. VueJS is a progressive and reactive JavaScript framework that enables building complex single-page applications, while ViteJS is a modern build tool that optimizes development and production workflows. UnoCSS, on the other hand, is a minimalistic and responsive CSS framework that makes it easy to create consistent and aesthetically pleasing UIs. The REST API is built using NestJS, which is a powerful and modular backend framework for building scalable and maintainable applications. It leverages the power of TypeScript to provide robust type-checking and high-level abstractions, making it easy to build complex APIs. This ensures that the platform's backend is reliable, secure and scalable. To further enhance the functionality of the platform, several additional technologies are used, including Minio, Redis, Traefik, PostgreSQL, and Docker. Minio is a high-performance object storage solution that makes it easy to store and access large amounts of data. Redis is an in-memory data structure store that enables fast and efficient data caching and retrieval. Traefik is a powerful and flexible reverse proxy and load balancer that enables efficient routing and load balancing of incoming traffic. PostgreSQL is a robust and powerful open-source relational database that provides reliable data storage and retrieval. Docker, on the other hand, is a popular containerization platform that ensures consistent and reliable deployment of the platform's components. Overall, the portfolio platform is a comprehensive and powerful solution that leverages the best of frontend and backend technologies to provide a fast, responsive, and user-friendly experience for managing and showcasing portfolios.",
      status: "completed",
      published: true,
      thumbnailUrl:
        "https://storage.naurislinde.dev/portfolio-public/1678130312829-Screenshot%202023-03-06%20at%2021-17-17%20Nauris%20Linde.png",
    },
  ];

  console.log("Seed start");
  await db.delete(experiences);
  await db.insert(experiences).values(experience_data);
  await db.delete(projects);
  await db.insert(projects).values(project_data);
  console.log("Seed done");
};

main();
