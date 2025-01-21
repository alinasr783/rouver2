import React, { useState, useEffect } from "react";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import "@fortawesome/fontawesome-free/css/all.css";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import "../css/help.css";

export default function Help() {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    window.scrollTo(0, 0); // التمرير إلى أعلى نقطة في الصفحة
  }, []); // [] لضمان تنفيذها مرة واحدة فقط عند التحميل


  return (
    <>
      <Header title="Help Center" back={"/profile"}/>
      <div className="help-content">
        <div className="help-content-search">
          <div className="help-search-input">
            <div className="help-search-input-content">
              <div className="help-search-input-content-input">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="help-content-tabs">
          <Tabs
            value={value}
            onChange={handleChange}
            className="custom-tabs"
          >
            <Tab label="FAQ" className="custom-tab" />
            <Tab label="Contact Us" className="custom-tab" />
          </Tabs>

          <div className="tab-content">
            {value === 0 && (
<>
      <Accordion>
        <AccordionSummary
          expandIcon={<>ورييينييييي</>}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">مين افضل مبرمج في العالم</Typography>
        </AccordionSummary>
        <AccordionDetails>
          يسطاااااا السوال وااااضح طبعا علي هو افضل مبرمج في العالم
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<>ورييينييييي</>}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">مين افضل مبرمج في العالم</Typography>
        </AccordionSummary>
        <AccordionDetails>
          يسطاااااا السوال وااااضح طبعا علي هو افضل مبرمج في العالم
        </AccordionDetails>
      </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<>ورييينييييي</>}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">مين افضل مبرمج في العالم</Typography>
          </AccordionSummary>
          <AccordionDetails>
            يسطاااااا السوال وااااضح طبعا علي هو افضل مبرمج في العالم
          </AccordionDetails>
        </Accordion>
  <Accordion>
    <AccordionSummary
      expandIcon={<>ورييينييييي</>}
      aria-controls="panel1-content"
      id="panel1-header"
    >
      <Typography component="span">مين افضل مبرمج في العالم</Typography>
    </AccordionSummary>
    <AccordionDetails>
      يسطاااااا السوال وااااضح طبعا علي هو افضل مبرمج في العالم
    </AccordionDetails>
  </Accordion>
  <Accordion>
    <AccordionSummary
      expandIcon={<>ورييينييييي</>}
      aria-controls="panel1-content"
      id="panel1-header"
    >
      <Typography component="span">مين افضل مبرمج في العالم</Typography>
    </AccordionSummary>
    <AccordionDetails>
      يسطاااااا السوال وااااضح طبعا علي هو افضل مبرمج في العالم
    </AccordionDetails>
  </Accordion>
  <Accordion>
    <AccordionSummary
      expandIcon={<>ورييينييييي</>}
      aria-controls="panel1-content"
      id="panel1-header"
    >
      <Typography component="span">مين افضل مبرمج في العالم</Typography>
    </AccordionSummary>
    <AccordionDetails>
      يسطاااااا السوال وااااضح طبعا علي هو افضل مبرمج في العالم
    </AccordionDetails>
  </Accordion>
  <Accordion>
    <AccordionSummary
      expandIcon={<>ورييينييييي</>}
      aria-controls="panel1-content"
      id="panel1-header"
    >
      <Typography component="span">مين افضل مبرمج في العالم</Typography>
    </AccordionSummary>
    <AccordionDetails>
      يسطاااااا السوال وااااضح طبعا علي هو افضل مبرمج في العالم
    </AccordionDetails>
  </Accordion>
  <Accordion>
    <AccordionSummary
      expandIcon={<>ورييينييييي</>}
      aria-controls="panel1-content"
      id="panel1-header"
    >
      <Typography component="span">مين افضل مبرمج في العالم</Typography>
    </AccordionSummary>
    <AccordionDetails>
      يسطاااااا السوال وااااضح طبعا علي هو افضل مبرمج في العالم
    </AccordionDetails>
  </Accordion>
</>
    )}
            {value === 1 && (
  <>
      <Accordion>
        <AccordionSummary
          expandIcon={<>ورييينييييي</>}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">ازاي اتواصل مع افضل فروند اند في العالم ضروووري</Typography>
        </AccordionSummary>
        <AccordionDetails>
          يسطا معلش هو مش فاضي دلوقتي؛ لما يفضي هنبقي نبعتلك اشعار
        </AccordionDetails>
      </Accordion>
  </>
            )}
          </div>
        </div>
        <div className="help-content-accordion">
        </div>
      </div>
      <BottomHeader />
    </>
  );
}