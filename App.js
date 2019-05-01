

import React from 'react';
import {StyleSheet,FlatList,Text,ActivityIndicator,Picker, View} from 'react-native';

export default class App extends React.Component{
  state = {
      data: [],
      page:1,
      sort:"price",
      refresh:false
    }
  
    
  componentWillMount(){
    this.getData()
  }
  
  getData = async ()=> {
    let iniSort = this.state.sort
    const url = `http://192.168.100.103:3000/products/api/products?_limit=15&_page=${this.state.page}&_sort=${iniSort}`;
   fetch(url)
    .then((response)=> response.json())
    .then((responseJson)=> {
      let oldData = Object.assign([], this.state.data)
      oldData.push(...responseJson)
      this.setState({
       data:oldData,
       refresh:false
    })
  })
  } 
  
  handleLoadMore = () => {
    this.setState(
      state => ({page:state.page + 1}),() => this.getData()
    )
  }

   updateSort = async () => {
   await this.state({ 
      page: 1,
      sort: sort,
      refresh:true},()=>this.getData())
    } 

   renderHeader = ()=>{
    return (
    <View style={{marginTop:0}}>
      <View style={{padding:10}}>
      <Picker selectedValue = {this.state.sort} onValueChange = {(sort)=>{
        this.setState({ sort: sort})
          }}>
        <Picker.Item label = "size" value = "size" />
        <Picker.Item label = "price" value = "price" />
        <Picker.Item label = "id" value = "id" />
            </Picker>
      </View>
    </View>
    )
  }

  renderFooter = () => {
    return(
      <View style = {styles.loader}>
      <ActivityIndicator animating size="large" />
      </View> 
    )
  }

  dollarFormat = (valuePrice) => {
    var num = valuePrice
    num /= 100;
    return num.toLocaleString("en-US", {style:"currency", currency:"USD"});
  }

  getTime = (date) => {
 
    if (typeof date !== 'object') {
      date = new Date(date);
    }
  
    let seconds = Math.floor((new Date() - date) / 1000);
    let intervalType;
  
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      intervalType = 'year';
    } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        intervalType = 'month';
      } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          intervalType = 'day';
        } else {
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            intervalType = "hour";
          } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
              intervalType = "minute";
            } else {
              interval = seconds;
              intervalType = "second";
            }
          }
        }
      }
  
    if (interval > 1 || interval === 0) {
      intervalType += 's';
    }
  
    return interval + ' ' + intervalType;
  };
  }

renderRow = ({item,index}) => {
  return(
    
  <View style={styles.item}>
  <Text style={styles.time}>{`${this.getTime(item.date)} ago`}</Text>
  <Text style={styles.info}>{`$${this.dollarFormat(item.price)}`}</Text>
  <Text style={{fontSize:item.size,color:'#fff'}}>{item.face}</Text>
  <Text style={styles.itemText}>{item.id}</Text>
  </View> 
  )
}

  render() {
    return (
      
      <FlatList
       numColumns={2}
       data={this.state.data}
       extraData={this.state}
       style={styles.container}
       renderItem={this.renderRow}
       keyExtractor={(item,index) => index.toString()}
       onEndReached={()=>this.handleLoadMore()}
       onEndReachedThreshold={0.5}
       ListFooterComponent={this.renderFooter}
       ListHeaderComponent={()=>this.renderHeader()}
       refreshing={this.state.refresh}
       refresh={this.updateSort}

      />
    
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 20,
    },

    item: {
      backgroundColor: '#222f3e',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      margin: 1,
      height: 150 
    },

    itemText:{
      color:'#fff'
    },

    info:{
      right:10,
      top:4,
      color:'#fff',
      position:'absolute'
    },
    
    time:{
      left:10,
      top:4,
      color:'#fff',
      position:'absolute'
    }
});


