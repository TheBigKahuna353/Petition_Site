import React from "react"
import PetitionList from "../Components/petitionList"
import Menu  from "../Components/Menu"
import { usePetitionStore } from "../store"
import axios from "axios"
import { TextField, Autocomplete, Checkbox, FormControl, InputLabel, Select, MenuItem, Pagination } from "@mui/material"

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import CSS from 'csstype';

const sortOptions = [
    {name : "Ascending alphabetically", serverCode: "ALPHABETICAL_ASC"},
    {name: "Descending alphabetically", serverCode: "ALPHABETICAL_DESC"},
    {name: "Ascending by supporting cost", serverCode: "COST_ASC"},
    {name: "Descending by supporting cost", serverCode: "COST_DESC"},
    {name: "Ascending by creation date", serverCode: "CREATED_ASC"},
    {name: "Descending by creation date", serverCode: "CREATED_DESC"},
]

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Petitions = () => {


    const [petitions, setPetitions] = React.useState < Array < Petition >> ([])
    const [NumPetitions, setNumPetitions] = React.useState(0)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [sort, setSort] = React.useState(sortOptions[4])
    const [catFilter, setCatFilter] = React.useState<Array<number>>([])
    const [search, setSearch] = React.useState<string>("")
    const [page, setPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)



    React.useEffect(() => {
        const getParams = () => {
            const params = {
                sortBy: sort.serverCode,
                categoryIds: catFilter,
                count: pageSize,
                startIndex: (page - 1) * pageSize,
                ...((search !== "") && {q: search})
            }
            return params
        }
        const getPetitions = () => {
            axios.get('http://localhost:4941/api/v1/petitions', {params: getParams()})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setPetitions(response.data.petitions)
                setNumPetitions(response.data.count)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
        }
        getPetitions()
    }, [sort, catFilter, search, page, pageSize])


    const handleSort = (event: any) => {
        setSort(sortOptions[event.target.value])
    }

    const handleCats = (event: any, newValue: Catergory[]) => {
        setCatFilter(newValue.map((cat) => cat.categoryId))
    }

    const handleSearch = (event: any) => {
        if (event.key === "Enter") {
            setSearch(event.target.value)
        }
    }

    const handlePageSize = (event: any, value: number) => {
        setPage(value)
    }

    const categories = usePetitionStore(state => state.Categories)
    const setCategories = usePetitionStore(state => state.setCategories)
    React.useEffect(() => {
        if (categories.length === 0) {
            axios.get("http://localhost:4941/api/v1/petitions/categories")
            .then(response => {
                setCategories(response.data)
            })
            .catch(error => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
        }
    }, [setCategories, categories])

    const pageCSS: CSS.Properties = {
        margin: "auto",
        display: "inline-block",
        padding: "10px"
    }

    
    if (errorFlag) {
        return (
            <div>
                <h1>Error</h1>
                <p>{errorMessage}</p>
            </div>
        )
    }

    return (
        <div>
            <Menu />
            <div style={{position:"relative"}}>
                <TextField
                    id="outlined-basic"
                    label="Search"
                    variant="outlined"
                    onKeyPress={handleSearch}
                    style = {{width: 300, right: 0, position: "absolute", margin: "10px"}}
                />
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={categories}
                    disableCloseOnSelect
                    onChange={handleCats}
                    getOptionLabel={(option) => option.name}
                    limitTags={2}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                        <Checkbox
                            icon={icon}
                            key={option.categoryId}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                        </li>       
                    )}
                    style={{ width: 500, margin: "10px", display: "inline-block"}}
                    renderInput={(params) => (
                        <TextField {...params} variant="outlined" label="Filter Catergories" placeholder="Catergories" />
                    )}
                />
                <FormControl style={{margin: "10px"}}>
                    <InputLabel id="sort-label">Sort</InputLabel>
                        <Select
                            labelId="sort-label"
                            id="sort"
                            value={sort.name}
                            label="Sort"
                            onChange={handleSort}
                            style={{width: 300}}
                            displayEmpty
                            renderValue={(value: string) => value}
                        >
                            {sortOptions.map((option, index) => {
                                return (
                                    <MenuItem value={index}>{option.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
            </div>
            <div>
                <p>Showing Petitions {(page-1)*pageSize+1} to {Math.min(page*pageSize, NumPetitions)} of {NumPetitions}</p>
                <FormControl>
                    <InputLabel id="pageSize-label">Size</InputLabel>
                    <Select 
                    id="pageSize" 
                    labelId="pageSize-label"
                    value={pageSize} 
                    label="Page Size"
                    onChange={(event) => setPageSize(event.target.value as number)} 
                    >
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <PetitionList petitions={petitions} catergories={categories}/>
            <div style={pageCSS}>
                <Pagination count={Math.ceil(NumPetitions/pageSize)} page={page} onChange={handlePageSize} style={pageCSS} />
            </div>
        </div>
    )
}


export default Petitions;