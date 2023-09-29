import React from "react";
import styles from "./merchant-landing-page.module.scss";
import { TrifoodLogo, NoAvatar, Notification, ShoppingCartIcon, SmsIcon } from "../../commons/resources";
import CustomInput from "../../commons/components/CustomInput/CustomInput";
import { ArrowRightYellowIcon, SearchIcon } from "../../assets/icons";
import PrimaryButton from "../../commons/components/PrimaryButton/PrimaryButton";
import { FOOTER_ITEMS, socialMediaItems } from "../PreviewProduct/PreviewProduct";
import MerchantStoreBanner from "./MerchantBanner/MerchantBanner";
import LandingPageInformation from "./LandingPageInformation/LandingPageInformation";
import ProductView from "./ProductView/ProductView";
import OurMenu from "./OurMenu/OurMenu";
import CustomerReviews from "./CustomerReviews/CustomerReviews";

const MerchantLandingPage: React.FC = () => {
  const banners = [
    "https://loremflickr.com/cache/resized/65535_52295363701_cce36404e0_z_640_480_nofilter.jpg",
    "https://loremflickr.com/cache/resized/65535_52462898608_924dc41d06_z_640_480_nofilter.jpg",
  ];
  return (
    <>
      <div className={[styles.previewProduct].join(" ")}>
        <div className={styles.navigationBar}>
          <TrifoodLogo />
          <CustomInput
            className={styles.search}
            placeholder="Search for items, merchants, user..."
            prefix={<SearchIcon />}
          />
          <div className={styles.menu}>
            <div className={styles.menuItem}>Marketplace</div>
            <div className={styles.menuItem}>News & Events</div>
            <div className={styles.icon}>
              <Notification />
            </div>
            <div className={styles.icon}>
              <ShoppingCartIcon />
            </div>
          </div>
          <div className={styles.profile}>
            <img src={NoAvatar} alt="avatar" />
            <div>Username</div>
          </div>
        </div>
        <MerchantStoreBanner banners={banners} />
        <div className={styles.pd120px}>
          <LandingPageInformation />
          <ProductView title="Featured dishes" />
          <ProductView title="Must try today" />
          <OurMenu />
          <CustomerReviews />
        </div>
        <div className={styles.footer}>
          <div className={styles.categories}>
            <div className={styles.socials}>
              <TrifoodLogo />
              <div className={styles.socialNetworks}>
                {socialMediaItems.map((socialMediaItem: ISocialMedia) => (
                  <a href={socialMediaItem.link} target="_blank" rel="noreferrer" key={socialMediaItem.name}>
                    {socialMediaItem.icon}
                  </a>
                ))}
              </div>
            </div>
            <div className={styles.items}>
              {FOOTER_ITEMS.map(item => (
                <div style={{ minWidth: "180px" }}>{item}</div>
              ))}
            </div>
            <div className={styles.contact}>
              <div className={styles.title}>Subscribe to Our Newsletter</div>
              <div className={styles.form}>
                <CustomInput className={styles.email} placeholder="Your email address" prefix={<SmsIcon />} />{" "}
                <PrimaryButton className={styles.submitButton}>Submit</PrimaryButton>
              </div>
            </div>
          </div>
          <div className={styles.retangle}></div>
          <div className={styles.copyright}>© 2022 by Tridentity. All rights reserved</div>
        </div>
      </div>
    </>
  );
};

export default MerchantLandingPage;
