import React from 'react'
import { getService } from 'vc-cake'

const dataProcessor = getService('dataProcessor')
const dataManager = getService('dataManager')

export default function InstallAtarim () {
  const processCommentButtonClick = () => {
    dataProcessor.appServerRequest({
      'vcv-action': 'atarim:comment:button:click:adminNonce',
      'vcv-nonce': dataManager.get('nonce')
    })

    if (window.VCV_ADMIN_URL) {
      window.open(window.VCV_ADMIN_URL() + '/plugin-install.php?s=atarim%2520visual%2520collaboration&tab=search&type=term', '_blank')
    }
  }

  return (
    <div className='ia-container'>
      <div className='ia-wrapper'>
        <div className='ia-header'>
          Collaborate Visually <br/> Directly On Your Website
        </div>
        <div className='ia-content'>
          Install Atarim&apos;s Visual Collaboration Plugin
          to communicate with other users within your own website, <br/>
          seemlessly integrate to Visual Composer
        </div>
        <button className='ia-comment-button'
          onClick={() => processCommentButtonClick()}
        >
          Start Collaborating For Free
        </button>
        <div
          style={{ overflow: 'hidden', borderRadius: '15px', marginBottom: '15px' }}
        >
          <video autoPlay >
            <source src="https://wpfeedback-image.s3.us-east-2.amazonaws.com/public_videos/Atarim+Welcome+Plugin+version.mp4" type="video/mp4"/> </video>

        </div>
        <div className='ia-powerby-wrapper'>
          <span className='ia-text-power'>Powered by</span>
          <svg style={{ width: '100px', padding: '0 5px' }} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 292">
            <defs>
            </defs>
            <title>#9304 - New logo request</title>
            <g>
              <g>
                <g>
                  <polygon fill="#052055" points="259.935 212.609 206.901 232.093 236.261 288.676 299.495 288.602 259.935 212.609"/>
                  <polygon fill="#052055" points="149.731 0.11 0 288.602 63.269 288.602 149.712 121.876 180.879 181.943 233.913 162.459 149.731 0.11"/>
                </g>
                <polygon fill="#6d5df3" points="63.132 288.697 103.705 210.548 292.583 138.683 63.132 288.697"/>
              </g>
              <g>
                <path fill="#052055" d="M403.20866,251.38122v40.28606H379.0375q-25.83835,0-40.28606-12.64151-14.44889-12.63854-14.4471-41.25775V176.08927H305.41156V136.6371h18.89278V98.85155H371.814V136.6371h31.11734v39.45217H371.814V238.324q0,6.94737,3.33381,10.002,3.33381,3.05941,11.11329,3.05525Z"/>
                <path fill="#052055" d="M429.183,171.921q9.02587-18.05709,24.5887-27.78234a64.19146,64.19146,0,0,1,34.72912-9.72406q16.3893,0,28.75523,6.66762a49.135,49.135,0,0,1,19.03176,17.50354V136.6371h47.50961V291.66728H536.28785V269.71866a51.33837,51.33837,0,0,1-19.30914,17.50354q-12.36591,6.66762-28.75581,6.66762a63.0096,63.0096,0,0,1-34.45116-9.863q-15.56341-9.85888-24.5887-28.0615-9.03121-18.19251-9.02914-42.09165Q420.1539,189.98282,429.183,171.921Zm97.24177,14.17033a33.3882,33.3882,0,0,0-48.06495-.139q-9.86513,10.144-9.86305,27.92132,0,17.78448,9.86305,28.20048a33.07787,33.07787,0,0,0,48.06495.139q9.85888-10.27584,9.863-28.0615Q536.28785,196.376,526.42481,186.09129Z"/>
                <path fill="#052055" d="M686.59142,142.33184a53.76082,53.76082,0,0,1,27.78294-7.36253v50.28808H701.31649q-17.78359,0-26.67167,7.6405-8.89579,7.64408-8.89075,26.81065v71.95874H618.24445V136.6371h47.50962v25.83777A62.72426,62.72426,0,0,1,686.59142,142.33184Z"/>
                <path fill="#052055" d="M740.62789,113.15967A23.85239,23.85239,0,0,1,732.71,94.96121,24.17438,24.17438,0,0,1,740.62789,76.486q7.91847-7.359,20.421-7.36254,12.22249,0,20.143,7.36254a24.17438,24.17438,0,0,1,7.91788,18.47523,23.85239,23.85239,0,0,1-7.91788,18.19846q-7.91845,7.36431-20.143,7.36253Q748.54665,120.5222,740.62789,113.15967Zm44.03682,23.47743V291.66728H737.15509V136.6371Z"/>
                <path fill="#052055" d="M1062.91341,152.47285Q1080.00119,169.9758,1080,201.09432v90.573h-47.23046V207.484q0-15.003-7.91847-23.19947-7.91845-8.19108-21.80963-8.19524-13.89831,0-21.80964,8.19524-7.91847,8.19822-7.91847,23.19947v84.1833H926.08049V207.484q0-15.003-7.91846-23.19947-7.91847-8.19108-21.80964-8.19524-13.89474,0-21.80964,8.19524-7.91757,8.19822-7.91787,23.19947v84.1833H819.11526V136.6371h47.50962v19.44812a50.87689,50.87689,0,0,1,18.89159-15.42,59.43782,59.43782,0,0,1,26.39489-5.69592q17.50473,0,31.25573,7.50151a53.79144,53.79144,0,0,1,21.53167,21.39388,62.47771,62.47771,0,0,1,21.94981-20.83794,59.29966,59.29966,0,0,1,30.284-8.05745Q1045.82326,134.96931,1062.91341,152.47285Z"/>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
