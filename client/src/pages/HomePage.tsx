import { UserIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const navigationItems = [
  { label: "HOME" },
  { label: "ABOUT US" },
  { label: "JOBS" },
  { label: "CONTACT US" },
];

const contactInfo = [
  {
    icon: "/figmaAssets/icon-email.svg",
    text: "1010 Avenue Of the moon\nlorem ipsum loresus",
  },
  {
    icon: "/figmaAssets/icon-address.svg",
    text: "Write us\ninfo@consultancy.com",
  },
  {
    icon: "/figmaAssets/icon-phone.svg",
    text: "212 456 879\nFree Call",
  },
];

const howItWorksSteps = [
  {
    number: "01",
    title: "Register Online",
    description:
      "we know your home is more than just a place to live, that's why we're committed to providing the best home loan",
    image: "/figmaAssets/ellipse-1328.svg",
    imagePosition: "left",
    contentPosition: "right",
    cardContent: {
      title: "Register Online",
      hasButton: true,
    },
  },
  {
    number: "02",
    title: "Browse Jobs",
    description:
      "It's the fast, easy way to apply for your mortgage and access your application anytime, anywhere. With our mortgage access center",
    image: "/figmaAssets/ellipse-1328.svg",
    imagePosition: "right",
    contentPosition: "left",
    searchContent: {
      title: "Search",
    },
  },
  {
    number: "03",
    title: "Apply & Track",
    description:
      "It's about you and your family, having a comfortable payment, exceptional service and a lender.",
    image: "/figmaAssets/ellipse-1328.svg",
    imagePosition: "left",
    contentPosition: "right",
    trackingImage: "/figmaAssets/group-690.png",
  },
  {
    number: "04",
    title: "Screening & Interviews",
    description:
      "It's the fast, easy way to apply for your mortgage and access your application anytime, anywhere. With our mortgage access center",
    image: "/figmaAssets/ellipse-1328.svg",
    imagePosition: "right",
    contentPosition: "left",
    searchContent: {
      title: "Search",
    },
  },
];

export const HomePage = (): JSX.Element => {
  return (
    <div className="bg-white w-full min-h-screen relative">
      <header className="w-full">
        <div className="w-full bg-[#11467a0d] py-3">
          <div className="max-w-[1512px] mx-auto px-[172px] flex items-center justify-end gap-[35px]">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <img
                  className="w-[18px] h-[18px] mt-0.5"
                  alt="Contact icon"
                  src={info.icon}
                />
                <div className="[font-family:'Poppins',Helvetica] font-normal text-text-2 text-sm tracking-[0] leading-[22.4px] whitespace-pre-line">
                  {info.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <nav className="w-full h-[67px] bg-[#11467a] flex items-center justify-between px-[172px]">
          <img
            className="w-[145px] h-[54px]"
            alt="Duke Consultancy Logo"
            src="/figmaAssets/image-5.png"
          />

          <div className="flex items-center gap-10">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                className="h-[38px] flex items-center justify-center px-0 py-2.5"
              >
                <span className="[font-family:'Poppins',Helvetica] font-medium text-white text-sm tracking-[0] leading-[normal]">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="w-[38px] h-[38px] flex items-center justify-center">
            <UserIcon className="w-[38px] h-[38px] text-white" />
          </div>
        </nav>
      </header>

      <main>
        <section className="w-full">
          <img
            className="w-full h-[600px] object-cover"
            alt="Hero section"
            src="/figmaAssets/hero-section.png"
          />
        </section>

        <section className="max-w-[1512px] mx-auto px-[180px] py-[100px]">
          <div className="grid grid-cols-2 gap-10 items-center">
            <div>
              <img
                className="w-full h-[386px] object-cover"
                alt="About Duke Consultancy"
                src="/figmaAssets/rectangle-1.png"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-5">
                <img
                  className="w-[83px] h-[3px]"
                  alt="Line"
                  src="/figmaAssets/line-1.svg"
                />
                <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-bluee text-[32px] tracking-[0] leading-[41.6px]">
                  About Duke Consltancy
                </h2>
              </div>

              <div className="[font-family:'Poppins',Helvetica] text-base tracking-[0] leading-[28.8px]">
                <span className="font-medium text-black">
                  Duke Consultancy is a healthcare recruitment and placement
                  firm dedicated to bridging the gap between skilled
                  professionals in Pakistan and healthcare institutions across
                  Europe, the UK, and other international destinations.
                  <br />
                </span>
                <span className="font-normal text-black">
                  With years of experience and a trusted process, we ensure
                  every candidate is guided through documentation, compliance,
                  and visa procedures smoothly, so they can focus on their
                  careers.
                </span>
              </div>

              <button className="flex items-center gap-1 px-0 py-[3px] w-fit">
                <span className="[font-family:'Poppins',Helvetica] font-medium text-[#11467a] text-sm tracking-[0] leading-[25.2px]">
                  Read More
                </span>
                <div className="w-[15px] h-[13px] flex items-center justify-center">
                  <img
                    className="w-[11px] h-2.5"
                    alt="Arrow"
                    src="/figmaAssets/arrow.svg"
                  />
                </div>
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-[1512px] mx-auto px-[180px] py-[50px]">
          <div className="flex flex-col items-center gap-[52px] mb-[90px]">
            <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-bluee text-[32px] text-center tracking-[0] leading-[48px]">
              How it works
            </h2>
            <p className="max-w-[594px] [font-family:'Poppins',Helvetica] font-normal text-[#425466] text-base text-center tracking-[0] leading-[26px]">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard
            </p>
          </div>

          <div className="flex flex-col gap-[90px]">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className={`relative flex items-center ${
                  step.imagePosition === "left"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                {step.imagePosition === "left" && (
                  <>
                    <div className="absolute left-0 top-0 [font-family:'Poppins',Helvetica] font-bold text-[#d6d6d6] text-8xl text-center tracking-[0] leading-[96px]">
                      {step.number}
                    </div>
                    <img
                      className="absolute left-[31px] top-[105px] w-[418px] h-[209px]"
                      alt="Background ellipse"
                      src={step.image}
                    />
                  </>
                )}

                {step.imagePosition === "right" && (
                  <>
                    <div className="absolute right-[507px] top-0 [font-family:'Poppins',Helvetica] font-bold text-[#d6d6d6] text-8xl text-center tracking-[0] leading-[96px]">
                      {step.number}
                    </div>
                    <img
                      className="absolute right-[31px] top-[48px] w-[418px] h-[209px]"
                      alt="Background ellipse"
                      src={step.image}
                    />
                  </>
                )}

                <div
                  className={`flex items-center gap-[100px] w-full ${
                    step.contentPosition === "left"
                      ? "flex-row"
                      : "flex-row-reverse"
                  }`}
                >
                  <div className="flex flex-col gap-[18px] w-[346px]">
                    <h3 className="[font-family:'Poppins',Helvetica] font-medium text-bluee text-2xl tracking-[-0.24px] leading-[normal]">
                      {step.title}
                    </h3>
                    <p className="[font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-[30px]">
                      {step.description}
                    </p>
                  </div>

                  <div className="relative">
                    {step.cardContent && (
                      <Card className="w-[325px] h-[285px] bg-white border-[0.6px] border-[#f1f1f1] shadow-[0px_1.12px_1.9px_#38383806,0px_4.91px_3.93px_#3838380a,0px_12.05px_7.83px_#3838380d,0px_23.21px_15.35px_#38383810,0px_39.05px_28.23px_#38383813]">
                        <CardContent className="p-[36px]">
                          <div className="flex flex-col gap-[21.8px]">
                            <h4 className="[font-family:'Poppins',Helvetica] font-medium text-[#222831] text-[26.2px] tracking-[-0.26px] leading-[normal] text-center">
                              {step.cardContent.title}
                            </h4>
                            <div className="flex flex-col gap-[15.3px]">
                              <div className="h-[10.92px] bg-[#f1f1f1] rounded-[65.52px]" />
                              <div className="h-[10.92px] bg-[#f1f1f1] rounded-[65.52px] ml-[12px]" />
                              <div className="h-[10.92px] bg-[#f1f1f1] rounded-[65.52px] ml-[15.3px]" />
                              <div className="h-[10.92px] bg-[#f1f1f1] rounded-[65.52px] ml-[12px]" />
                            </div>
                            {step.cardContent.hasButton && (
                              <div className="flex justify-center mt-[27.3px]">
                                <Button className="h-[34.94px] bg-[#11467a] text-white text-[10.8px] px-6">
                                  Sign up
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {step.searchContent && (
                      <div className="w-[385px] h-[137px]">
                        <Card className="w-[383px] h-[137px] bg-white border-[0.83px] border-[#f1f1f1] shadow-[0px_1.53px_2.61px_#38383806,0px_6.74px_5.39px_#3838380a,0px_16.55px_10.76px_#3838380d,0px_31.88px_21.09px_#38383810,0px_53.64px_38.77px_#38383813]">
                          <CardContent className="p-0">
                            <div className="pt-[13px] pb-[57px] px-[39px]">
                              <h4 className="[font-family:'Poppins',Helvetica] font-normal text-[#313131] text-[22px] text-center tracking-[0] leading-[normal] mb-[44px]">
                                {step.searchContent.title}
                              </h4>
                              <div className="relative w-[315px] h-[50px] bg-neutral-50 shadow-[inset_0px_0px_6px_#00000026]">
                                <img
                                  className="absolute top-2 left-[238px] w-[9px] h-[42px]"
                                  alt="Divider"
                                  src={
                                    index === 1
                                      ? "/figmaAssets/group-1000001638.png"
                                      : "/figmaAssets/group-1000001638-1.png"
                                  }
                                />
                                <img
                                  className="absolute top-[17px] left-[267px] w-[21px] h-[21px]"
                                  alt="Search"
                                  src={
                                    index === 1
                                      ? "/figmaAssets/search-1.png"
                                      : "/figmaAssets/search-1-1.png"
                                  }
                                />
                                <span className="absolute top-[17px] left-[13px] [font-family:'Poppins',Helvetica] font-normal text-[#d6d6d6] text-xs tracking-[0] leading-[normal]">
                                  Search services
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {step.trackingImage && (
                      <img
                        className="w-[378px] h-[207px]"
                        alt="Application tracking"
                        src={step.trackingImage}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-[1512px] mx-auto px-[180px] py-[50px] flex justify-center">
          <Button className="h-12 bg-orange hover:bg-orange/90 text-white px-[30px] py-2.5 rounded flex items-center gap-2.5">
            <span className="[font-family:'Poppins',Helvetica] font-medium text-sm text-center tracking-[0] leading-6">
              Start Your Application
            </span>
            <img
              className="w-[11px] h-2.5"
              alt="Arrow"
              src="/figmaAssets/arrow.svg"
            />
          </Button>
        </section>

        <section className="w-full bg-[#11467a0d]">
          <div className="max-w-[1512px] mx-auto grid grid-cols-2 gap-16 items-center">
            <div>
              <img
                className="w-full h-[460px] object-cover"
                alt="Why Choose Duke Consultancy"
                src="/figmaAssets/rectangle-1-1.png"
              />
            </div>

            <div className="flex flex-col gap-5 pr-[180px]">
              <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-bluee text-[32px] tracking-[0] leading-[41.6px]">
                Why Choose Duke Consultancy
              </h2>
              <img
                className="w-[83px] h-[3px]"
                alt="Line"
                src="/figmaAssets/line-1.svg"
              />
              <div className="[font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-[28.8px]">
                Expertise in international healthcare recruitment.
                <br />
                End-to-end support from application to relocation.
                <br />
                Transparent tracking through your personal dashboard.
                <br />
                Strong network of employers across Europe & beyond.
                <br />
                Focus on ethical, compliant, and professional recruitment.
              </div>
              <button className="flex items-center gap-1 px-0 py-[3px] w-fit">
                <span className="[font-family:'Poppins',Helvetica] font-medium text-blue-text1 text-sm tracking-[0] leading-[25.2px]">
                  Read More
                </span>
                <div className="w-[15px] h-[13px] flex items-center justify-center">
                  <img
                    className="w-[11px] h-2.5"
                    alt="Arrow"
                    src="/figmaAssets/arrow.svg"
                  />
                </div>
              </button>
            </div>
          </div>
        </section>

        <section className="w-full">
          <img
            className="w-full h-[179px]"
            alt="About us section"
            src="/figmaAssets/about-us.png"
          />
        </section>

        <section className="w-full">
          <img
            className="w-full h-[552px]"
            alt="About us section"
            src="/figmaAssets/about-us-1.png"
          />
        </section>

        <section className="w-full">
          <img
            className="w-full h-[420px]"
            alt="About us section"
            src="/figmaAssets/about-us-2.png"
          />
        </section>
      </main>
    </div>
  );
};
