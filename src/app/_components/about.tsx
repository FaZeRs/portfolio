const About = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 dark:text-white">
      <div
        className="
            container
            mx-auto flex
            flex-col
            items-center
            px-8
            py-16
            md:py-20
            lg:flex-row
          "
      >
        <div className="w-full text-center lg:text-left">
          <h2
            className="
                text-4xl
                font-semibold
                uppercase
                text-indigo-700
                sm:text-5xl
                lg:text-6xl
              "
          >
            Who am I?
          </h2>
          <h4
            className="
                font-header
                pt-6
                text-xl
                font-medium
                sm:text-2xl
                lg:text-3xl
              "
          >
            I&apos;m Nauris Linde, a Backend Developer
          </h4>
          <p className="font-body pt-6 leading-relaxed text-slate-600 dark:text-slate-300">
            I am a C++ developer with expertise in desktop app and full-stack
            web dev. I create high-quality software using various skills and
            knowledge.
          </p>
          <p className="font-body pt-6 leading-relaxed text-slate-600 dark:text-slate-300">
            My C++ skills enable me to design complex and efficient desktop apps
            for Windows, Linux, and macOS. I use C++ libraries and frameworks
            like Qt, OpenCV, and STL to optimize code and build scalable
            applications.
          </p>
          <p className="font-body pt-6 leading-relaxed text-slate-600 dark:text-slate-300">
            I am proficient in full-stack web dev using NodeJS, Typescript,
            VueJS, and NestJS. I develop e-commerce platforms, dashboards, and
            inventory management systems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
