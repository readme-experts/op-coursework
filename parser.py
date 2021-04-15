from html.parser import HTMLParser
from urllib.request import urlopen
import re
import json
import sys

class CurrencyParser(HTMLParser): 
    is_tr = False 
    ParseData = list()
    temp_list = list()

    def __init__(self, site_name, *args, **kwargs):
        self.site_name = site_name
        super().__init__(*args, **kwargs)
        self.feed(self.read_site_content())
    

    def read_site_content(self):
        return str(urlopen(self.site_name).read())


    def handle_starttag(self, tag, attrs):
        if tag == 'tr':
            self.is_tr = True


    def handle_endtag(self, tag):
        if tag == 'tr':
            self.is_tr = False
            find_list = ' '.join(self.temp_list)
            currencies = re.findall(r'[A-Z]{3}', find_list)
            rate = re.findall(r'[0-9]+,[0-9]+', find_list)
            curr_amount = re.findall(r'1[0]{0,3}', find_list)
            curr_amount = max(map(int, curr_amount))
            if currencies and rate and curr_amount: 
                self.ParseData.append([currencies[0], curr_amount, rate[0] + ' UAH'])
                self.temp_list.clear()


    def handle_data(self, data):
        if self.is_tr == True:
            self.temp_list.append(data)


    def data_to_json(self): 
        data = list()
        for item in self.ParseData: 
            data.append(
                {
                    'currency': item[0],
                    'exchangeAmount': item[1],
                    'exchangeRate': item[2],
                })
        return json.dumps(data)
    


parser = CurrencyParser('https://bank.gov.ua/ua/markets/exchangerates')
print(parser.data_to_json())
sys.stdout.flush()
