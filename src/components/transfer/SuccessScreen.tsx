interface SuccessScreenProps {
    onViewTransaction: () => void
    onNewRequest: () => void
}

// Success illustration using CSS ellipses
function SuccessIllustration() {
    return (
        <div className="w-[200px] h-[118px] relative">
            {/* Blur effect ellipse */}
            <div
                className="absolute w-[130px] h-[72px] rounded-full bg-[#81ACD6]"
                style={{
                    left: '-22px',
                    top: '23px',
                    filter: 'blur(50px)',
                }}
            />
            {/* Left dashed circle - opacity 0.4 */}
            <div
                className="absolute w-[93px] h-[93px] rounded-full border border-[#3D5E7F] opacity-40"
                style={{
                    left: '26px',
                    top: '13px',
                }}
            />
            {/* Middle dashed circle - opacity 0.7 */}
            <div
                className="absolute w-[93px] h-[93px] rounded-full border border-[#3D5E7F] opacity-70"
                style={{
                    left: '55px',
                    top: '13px',
                }}
            />
            {/* Right solid circle */}
            <div
                className="absolute w-[93px] h-[93px] rounded-full border border-[#3D5E7F]"
                style={{
                    left: '84px',
                    top: '13px',
                }}
            />
        </div>
    )
}

export function SuccessScreen({ onViewTransaction, onNewRequest }: SuccessScreenProps) {
    return (
        <div className="w-full min-h-[500px] rounded-[20px] overflow-hidden flex flex-col items-center justify-center px-[50px] pt-[50px] pb-[25px] gap-[10px] text-center font-['Inter_Tight']">
            {/* Illustration - centered */}
            <div className="flex items-center justify-center">
                <SuccessIllustration />
            </div>

            {/* Content */}
            <div className="self-stretch flex flex-col items-center py-[25px]">
                <div className="flex flex-col items-center gap-[25px]">
                    {/* Text Content */}
                    <div className="w-[550px] flex flex-col items-center gap-[20px]">
                        <h1
                            className="self-stretch text-[#191925] text-[40px] font-semibold leading-[120%] text-center"
                            style={{ fontFamily: 'Inter Tight', fontFeatureSettings: "'liga' off, 'clig' off" }}
                        >
                            Transaction
                            <br />
                            Successfully Created!
                        </h1>
                        <p
                            className="text-[#90A0AF] text-[16px] font-medium leading-[120%] text-center"
                            style={{ fontFamily: 'Inter Tight', fontFeatureSettings: "'liga' off, 'clig' off" }}
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            <br />
                            Pellentesque et pharetra lectus, ut rhoncus velit.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="w-[450px] flex items-center gap-[15px] text-[16px]">
                        <button
                            type="button"
                            onClick={onViewTransaction}
                            className="h-[45px] flex-1 backdrop-blur-[7.5px] rounded-[9px] bg-[rgba(104,129,153,0.3)] flex items-center justify-center px-[20px] py-[12px] text-[#05284B] text-[16px] font-semibold leading-[120%] text-center cursor-pointer hover:bg-[rgba(104,129,153,0.4)] transition-colors"
                            style={{ fontFamily: 'Inter Tight', fontFeatureSettings: "'liga' off, 'clig' off" }}
                        >
                            View Transaction
                        </button>
                        <button
                            type="button"
                            onClick={onNewRequest}
                            className="h-[45px] flex-1 rounded-[9px] bg-[#E2C889] flex items-center justify-center gap-[10px] px-[13px] py-[12px] text-[#473508] text-[16px] font-semibold leading-[120%] text-center cursor-pointer hover:bg-[#d4b97a] transition-colors"
                            style={{ fontFamily: 'Inter Tight', fontFeatureSettings: "'liga' off, 'clig' off" }}
                        >
                            New Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}