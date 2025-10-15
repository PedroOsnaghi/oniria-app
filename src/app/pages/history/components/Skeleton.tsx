import ContentLoader from "react-content-loader"

const SkeletonHistory = (props: any) => (
    <ContentLoader
        speed={0.4}
        width={400}
        height={460}
        viewBox="0 0 400 460"
        backgroundColor="#7f16a2"
        foregroundColor="#c516b7"
        {...props}
    >
        <circle cx="31" cy="31" r="15" />
        <rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
        <rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
        <circle cx="33" cy="106" r="15" />
        <rect x="60" y="93" rx="2" ry="2" width="140" height="10" />
        <rect x="60" y="109" rx="2" ry="2" width="140" height="10" />
        <circle cx="34" cy="185" r="15" />
        <rect x="61" y="172" rx="2" ry="2" width="140" height="10" />
        <rect x="61" y="188" rx="2" ry="2" width="140" height="10" />
        <circle cx="35" cy="263" r="15" />
        <rect x="62" y="250" rx="2" ry="2" width="140" height="10" />
        <rect x="62" y="266" rx="2" ry="2" width="140" height="10" />
        <circle cx="36" cy="340" r="15" />
        <rect x="63" y="327" rx="2" ry="2" width="140" height="10" />
        <rect x="63" y="343" rx="2" ry="2" width="140" height="10" />
        <circle cx="35" cy="415" r="15" />
        <rect x="62" y="402" rx="2" ry="2" width="140" height="10" />
        <rect x="62" y="418" rx="2" ry="2" width="140" height="10" />
    </ContentLoader>
)

export default SkeletonHistory

