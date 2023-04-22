import React, { useEffect, useState } from 'react'
import { getData } from './redux/action'
import { useDispatch, useSelector } from 'react-redux'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Loading from './Loading/Loading';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const App = () => {
  const dispatch = useDispatch()

  const [page, setPage] = useState(1);
  const handlePage = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  console.log("page" , page)

  const lastMonth = (num) => {
    let date = new Date()
    date.setDate(date.getDate() - num)
   
    var day = date.getDate()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
   if(month < 10){
    month =  "0"+month
   }
   if(day < 10){
    day = "0"+day
   }
     return `${year}-${month}-${day}`
  }

  console.log(lastMonth(30))

  const [alignment, setAlignment] = React.useState(lastMonth(30));

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  console.log(alignment)


  const getApiData = (date, page) => {
    fetch(`https://api.github.com/search/repositories?q=created:>${date}&sort=stars&order=desc&page=${page}`)
      .then(res => res.json())
      .then(data => dispatch(getData(data)))
  }
  useEffect(() => {
    
    getApiData(alignment, page)
     
   
  }, [alignment, page])

  let data = useSelector(state => state.dataFromApi.items)

  console.log(data)

 // const [date, setDate] = useState(new Date())

console.log(new Date())

 


  const getTimeInterval = (pushedAt) => {
    const currentDate = new Date();
    const lastPushedDate = new Date(pushedAt);
    const timeDifference = currentDate.getTime() - lastPushedDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return `${daysDifference} days ago`;
  };


  const [arrow , setArrow] = useState(<ArrowForwardIosIcon />)
  const [display, setDispaly] = useState("none")

  return (
    <>
    <div className='app_container'>
     <div className='content_container'>
     <header> <h1> Most Starred Repos </h1> </header>
     <ToggleButtonGroup
  color="primary"
  value={alignment}
  exclusive
  onChange={handleChange}
  aria-label="Platform"
  style={{marginBottom: "1em"}}
>
  <ToggleButton value={lastMonth(30)}>Last 30 Days</ToggleButton>
  <ToggleButton value={lastMonth(14)}>Last 2 Week</ToggleButton>
  <ToggleButton value={lastMonth(7)}>Last 1 Week</ToggleButton>
</ToggleButtonGroup>
      <div className='profile_lists'>
        {data === undefined ? (<><div className='loading'><Loading /></div></>) : (
          data.map(ele => {
          return(
            <>
              <div className='user_box'>
                <div className='left_box'>
                  <img src={ele.owner.avatar_url} alt="user-avatar" />
                </div>
                <div className='right_box'>
                    <h2> <a href={ele.html_url} target='_blank'>{ele.name}</a> </h2>
                    <p><b>{ele.description}</b></p>
                    <div className='right_small_box'>
                      <div className='repo_star'>
                        <h4>Stars: {ele.stargazers_count}</h4>
                      </div>
                      <div className='repo_issue'>
                        <h4>Issues: {ele.open_issues_count}</h4>
                      </div>
                      <div className='time_text'>
                        <p> Last pushed {getTimeInterval(ele.created_at)} by <strong> <a href={ele.owner.html_url} target='_blank'>{ele.owner.login}</a> </strong> </p>
                      </div>
                    </div>
  
                </div>
                <div className='arrow' style={{display: "none"}} onClick={() => {
                  if(display == "none"){
                    setArrow(<KeyboardArrowDownIcon />)
                    setDispaly("block")
                  }else{
                    setArrow(<ArrowForwardIosIcon />)
                    setDispaly("none")
                  }
                }}> {arrow}  </div>
                <div className='list' 
                style={{display: display}}>
                  <ul> 
                  <li>commits</li>
                  <li>Addiitions</li>
                  <li>Deletions</li>
                  </ul>
                </div>
              </div>
            </>
          )
        })
        )}
        
      </div>
      <div className='footer'>
      <Stack spacing={2}>
      <Typography><strong>Page: {page}</strong></Typography>
      <Pagination count={10} page={page} onChange={handlePage} color="primary" />
    </Stack>
      </div>
     </div>
    </div>
    </>
  )
}

export default App