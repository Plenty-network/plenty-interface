import './votestatic.module.scss';
import styles from './vote.module.scss';
import clsx from 'clsx';
export default function VoteModalResultscopy() {
  return (
    <div
    className={`justify-content-center mx-auto col-20 col-md-10 col-lg-10 col-xl-10 ${styles.gov}`}
  >
     <div className={clsx(styles.border, styles.textColor)}>
    <div className='vote_voteModal__2gcii'>
  <div className='vote_resultsHeader__CowbF'>
    <p className='vote_voteHeading__3uM3u'>Results</p>
    <p className='vote_res__Qf-6s vote_accepted__2aZ9m'>Accepted</p>
  </div>
  <div className='my-4 vote_line__1NEKt ' />
  <div className='vote_votingBox__3kXMW vote_textColor__35snG vote_borderChange__1W7wT vote_removeMargin__1TTvs'>
    <div className='vote_votingBoxBg__28C9S vote_selectedVotingBoxBg__1hLKA' style={{width: '85.44%'}} /><input className=' undefined' id='select-accept' type='radio' defaultValue='Accept' defaultChecked /><label className='ml-4 vote_selectItem__1iG5V vote_selectedVotingLabel__2OImu' htmlFor='select-accept'>Accepted</label><span className='vote_textColor__35snG vote_percentageResults__3Sjwa vote_selectedVotingText__1yaw-'>85.44%</span>
  </div>
  <div className='vote_totalStats__hOEcO'><span>311 votes</span><span className='mx-2  vote_dot__1ze-3' /><span>2432219.82 xplenty</span></div>
  <div className='vote_votingBox__3kXMW vote_textColor__35snG vote_borderChange__1W7wT vote_removeMargin__1TTvs'>
    <div className='vote_votingBoxBg__28C9S vote_defaultVotingBoxBg__1hPpZ' style={{width: '12.64%'}} /><input className=' undefined' id='select-reject' type='radio' defaultValue='Reject' defaultChecked /><label className='ml-4 vote_selectItem__1iG5V vote_defaultVotingText__3Uyx9' htmlFor='select-reject'>Rejected</label><span className='vote_textColor__35snG vote_percentageResults__3Sjwa vote_defaultVotingText__3Uyx9'>12.64%</span>
  </div>
  <div className='vote_totalStats__hOEcO'><span>46 votes </span><span className='mx-2  vote_dot__1ze-3' /><span>691601.38 xplenty</span></div>
  <div className='vote_votingBox__3kXMW vote_textColor__35snG vote_borderChange__1W7wT vote_removeMargin__1TTvs'>
    <div className='vote_votingBoxBg__28C9S vote_defaultVotingBoxBg__1hPpZ' style={{width: '1.92%'}} /><input className='undefined' id='select-abstained' type='radio' defaultValue='Abstain' defaultChecked /><label className='ml-4 vote_selectItem__1iG5V vote_defaultVotingText__3Uyx9' htmlFor='select-abstained'>Abstained</label><span className='vote_textColor__35snG vote_percentageResults__3Sjwa vote_defaultVotingText__3Uyx9'>1.92%</span>
  </div>
  <div className='vote_totalStats__hOEcO'><span>38909.68 xplenty</span></div><span className='mt-5  vote_totalStats__hOEcO'><svg width={17} height={18} viewBox='0 0 17 18' fill='none' xmlns='http://www.w3.org/2000/svg' className='mr-2 mb-1'>
      <path d='M11.4219 7.40625L7.52602 11.125L5.57812 9.26562' stroke='var(--theme-governance-buttonBorder)' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
      <path d='M8.5 15.375C12.0208 15.375 14.875 12.5208 14.875 9C14.875 5.47918 12.0208 2.625 8.5 2.625C4.97918 2.625 2.125 5.47918 2.125 9C2.125 12.5208 4.97918 15.375 8.5 15.375Z' stroke='var(--theme-governance-buttonBorder)' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
    </svg>364 total number of votes.</span>
  <div className='mt-3 vote_resultsDates__1wS7E'><span className='vote_startEndLabel__2qZBj'>Start Date</span><span className='vote_startEndDate__3SoM4'>December 15, 2021</span></div>
  <div className='mt-3 vote_resultsDates__1wS7E'>
    <div className='vote_startEndLabel__2qZBj'>End date</div>
    <div className='vote_startEndDate__3SoM4'><span>December 22, 2021</span></div>
  </div>
</div>
</div>
</div>
  );
}
